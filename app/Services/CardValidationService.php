<?php

namespace App\Services;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;

class CardValidationService
{
    /**
     * Lista de prefijos de tarjetas de prueba conocidos
     *
     * @var array
     */
    protected $testCardPrefixes = [
        '4242424242424242', // Tarjeta de prueba de Stripe (Visa)
        '4000000000000000', // Tarjeta de prueba genérica (Visa)
        '4000000000000002', // Tarjeta rechazada de Stripe
        '4000000000000069', // Tarjeta que requiere autenticación 3D Secure
        '4000000000000077', // Tarjeta rechazada por fondos insuficientes
        '4000000000000093', // Tarjeta rechazada por código postal incorrecto
        '4000000000000101', // Tarjeta rechazada por código de seguridad incorrecto
        '4000000000000119', // Tarjeta rechazada por fecha de expiración incorrecta
        '4000000000000127', // Tarjeta rechazada por error de procesamiento
        '4000000000000135', // Tarjeta rechazada por fraude
        '4000000000000143', // Tarjeta rechazada por robo
        '4000000000000150', // Tarjeta rechazada por pérdida
        '4000000000000168', // Tarjeta rechazada por expirada
        '4000000000000176', // Tarjeta rechazada por límite excedido
        '4000000000000184', // Tarjeta rechazada por restricción
        '4000000000000192', // Tarjeta rechazada por actividad inusual
        '4000000000000226', // Tarjeta rechazada por tipo de tarjeta no soportado
        '4000000000000309', // Tarjeta rechazada por restricción de comerciante
        '4000000000000341', // Tarjeta rechazada por autenticación requerida
        '4000000000009995', // Tarjeta rechazada por error de red
        '4000000000009979', // Tarjeta rechazada por error de sistema
        '4000000000009987', // Tarjeta rechazada por error de banco
        '4000000000009938', // Tarjeta rechazada por error de emisor
        '4000008400000007', // Tarjeta rechazada por error de adquirente
        '5555555555554444', // Tarjeta de prueba de Stripe (Mastercard)
        '2223003122003222', // Tarjeta de prueba de Stripe (Mastercard 2-series)
        '5200828282828210', // Tarjeta de prueba de Stripe (Mastercard prepago)
        '5105105105105100', // Tarjeta de prueba de Stripe (Mastercard)
        '378282246310005',  // Tarjeta de prueba de Stripe (American Express)
        '371449635398431',  // Tarjeta de prueba de Stripe (American Express)
        '6011111111111117', // Tarjeta de prueba de Stripe (Discover)
        '6011000990139424', // Tarjeta de prueba de Stripe (Discover)
        '3056930009020004', // Tarjeta de prueba de Stripe (Diners Club)
        '36227206271667',   // Tarjeta de prueba de Stripe (Diners Club)
        '3566002020360505', // Tarjeta de prueba de Stripe (JCB)
        '6200000000000005', // Tarjeta de prueba de Stripe (UnionPay)
    ];

    /**
     * Patrones de tarjetas falsas conocidos
     *
     * @var array
     */
    protected $fakeCardPatterns = [
        '/^1234/',          // Tarjetas que comienzan con 1234
        '/(\d)\1{5,}/',     // Secuencias de 6 o más dígitos repetidos (ej. 111111)
        '/^0/',             // Tarjetas que comienzan con 0
        '/^3[47]\d{13}$/',  // American Express con formato incorrecto (debería tener 15 dígitos)
        '/^4\d{12}(\d{3})?$/', // Visa con formato incorrecto (debería tener 13 o 16 dígitos)
        '/^(5[1-5]\d{14})$/', // Mastercard con formato incorrecto (debería tener 16 dígitos)
    ];

    /**
     * Verifica si una tarjeta es una tarjeta de prueba conocida
     *
     * @param string $cardNumber
     * @return bool
     */
    public function isTestCard(string $cardNumber): bool
    {
        // Eliminar espacios y guiones
        $cardNumber = preg_replace('/[\s-]/', '', $cardNumber);

        // Get first 6 digits for faster comparison
        $prefix6 = substr($cardNumber, 0, 6);

        // Use array_filter with a more efficient approach
        $matchingPrefixes = array_filter($this->testCardPrefixes, function($prefix) use ($cardNumber) {
            return strpos($cardNumber, substr($prefix, 0, 6)) === 0;
        });

        $isTestCard = !empty($matchingPrefixes);

        // Only log if it's a test card to reduce logging overhead
        if ($isTestCard) {
            Log::warning('Test card detected', ['card_prefix' => $prefix6]);
        }

        return $isTestCard;
    }

    /**
     * Verifica si una tarjeta parece ser falsa basándose en patrones conocidos
     *
     * @param string $cardNumber
     * @return bool
     */
    public function isFakeCard(string $cardNumber): bool
    {
        // Eliminar espacios y guiones
        $cardNumber = preg_replace('/[\s-]/', '', $cardNumber);

        // Verificar si el número de tarjeta coincide con algún patrón de tarjeta falsa
        foreach ($this->fakeCardPatterns as $pattern) {
            if (preg_match($pattern, $cardNumber)) {
                Log::warning('Posible tarjeta falsa detectada', ['card_prefix' => substr($cardNumber, 0, 6), 'pattern' => $pattern]);
                return true;
            }
        }

        // Verificar si la tarjeta pasa la validación de Luhn
        if (!$this->passesLuhnCheck($cardNumber)) {
            Log::warning('Tarjeta no pasa la validación de Luhn', ['card_prefix' => substr($cardNumber, 0, 6)]);
            return true;
        }

        return false;
    }

    /**
     * Verifica si un número de tarjeta pasa la validación de Luhn (mod 10)
     *
     * @param string $cardNumber
     * @return bool
     */
    public function passesLuhnCheck(string $cardNumber): bool
    {
        // Eliminar espacios y guiones
        $cardNumber = preg_replace('/[\s-]/', '', $cardNumber);

        // Algoritmo de Luhn (mod 10)
        $sum = 0;
        $length = strlen($cardNumber);
        $parity = $length % 2;

        for ($i = 0; $i < $length; $i++) {
            $digit = (int)$cardNumber[$i];

            if ($i % 2 == $parity) {
                $digit *= 2;

                if ($digit > 9) {
                    $digit -= 9;
                }
            }

            $sum += $digit;
        }

        return ($sum % 10) == 0;
    }

    /**
     * Verifica si una tarjeta es válida para procesar pagos
     *
     * @param string $cardNumber
     * @return array
     */
    public function validateCard(string $cardNumber): array
    {
        // Clean card number once
        $cleanCardNumber = preg_replace('/[\s-]/', '', $cardNumber);
        $cardPrefix = substr($cleanCardNumber, 0, 6);

        // Cache environment check to avoid multiple calls
        static $isProduction = null;
        if ($isProduction === null) {
            $isProduction = App::environment('production');
        }

        // Check if it's a test card
        $isTestCard = $this->isTestCard($cleanCardNumber);

        // Allow test cards in development/local environments but not in production
        if ($isTestCard) {
            if ($isProduction) {
                // Minimal logging in production
                Log::warning('Test card rejected in production', ['prefix' => $cardPrefix]);

                return [
                    'valid' => false,
                    'message' => 'Test cards are not allowed in production environment.'
                ];
            } else {
                // In development/local environment, allow test cards with minimal logging
                return [
                    'valid' => true,
                    'message' => 'Test card accepted in development environment.'
                ];
            }
        }

        // Always reject fake cards in any environment - only if not a test card
        if ($this->isFakeCard($cleanCardNumber)) {
            return [
                'valid' => false,
                'message' => 'The card appears to be invalid or fake.'
            ];
        }

        return [
            'valid' => true,
            'message' => 'Valid card'
        ];
    }

    /**
     * Verifica si un BIN (los primeros 6 dígitos) de tarjeta es válido
     *
     * @param string $bin
     * @return bool
     */
    public function isValidBin(string $bin): bool
    {
        // Eliminar espacios y guiones
        $bin = preg_replace('/[\s-]/', '', $bin);

        // Verificar que el BIN tenga 6 dígitos
        if (!preg_match('/^\d{6}$/', $bin)) {
            return false;
        }

        // Verificar si el BIN pertenece a una tarjeta de prueba
        foreach ($this->testCardPrefixes as $prefix) {
            if (strpos($prefix, $bin) === 0) {
                return false;
            }
        }

        // Aquí se podría agregar una verificación contra una API de BIN
        // para validar si el BIN es real y está activo

        return true;
    }
}
