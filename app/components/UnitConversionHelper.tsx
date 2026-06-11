import { useState } from 'react';
import { Card, Flex, Text, Button, TextField } from '@radix-ui/themes';

interface ConversionItem {
    from: string;
    to: string;
    factor: number;
}

const CONVERSIONS: ConversionItem[] = [
    { from: 'g', to: 'oz', factor: 0.03527396 },
    { from: 'oz', to: 'g', factor: 28.3495 },
    { from: 'ml', to: 'fl oz', factor: 0.033814 },
    { from: 'fl oz', to: 'ml', factor: 29.5735 },
    { from: 'ml', to: 'cup', factor: 0.00422675 },
    { from: 'cup', to: 'ml', factor: 236.588 },
];

export default function UnitConversionHelper() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedConversion, setSelectedConversion] = useState(0);

    const convert = () => {
        const num = parseFloat(inputValue);
        if (!isNaN(num)) {
            const conversion = CONVERSIONS[selectedConversion];
            return (num * conversion.factor).toFixed(4);
        }
        return '';
    };

    const IconCalculator = () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <rect x="8" y="6" width="8" height="8" />
            <line x1="8" y1="18" x2="12" y2="18" />
            <line x1="12" y1="18" x2="16" y2="18" />
        </svg>
    );

    return (
        <div className="unit-conversion-helper">
            <button
                className="unit-conversion-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Unit conversion helper"
                title="Unit Conversion Helper"
            >
                <IconCalculator />
            </button>

            {isOpen && (
                <Card className="unit-conversion-panel">
                    <Flex direction="column" gap="3">
                        <Text weight="bold" size="2">
                            Unit Converter
                        </Text>

                        <div className="conversion-form">
                            <TextField.Root
                                placeholder="Enter value"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                type="number"
                            />

                            <select
                                value={selectedConversion}
                                onChange={(e) =>
                                    setSelectedConversion(
                                        parseInt(e.target.value),
                                    )
                                }
                                className="conversion-select"
                            >
                                {CONVERSIONS.map((conv, idx) => (
                                    <option key={idx} value={idx}>
                                        {conv.from} → {conv.to}
                                    </option>
                                ))}
                            </select>

                            {inputValue && (
                                <div className="conversion-result">
                                    <Text size="1" color="gray">
                                        Result:
                                    </Text>
                                    <Text weight="bold" size="2">
                                        {convert()}{' '}
                                        {CONVERSIONS[selectedConversion].to}
                                    </Text>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={() => {
                                setInputValue('');
                                setIsOpen(false);
                            }}
                            variant="soft"
                            size="1"
                        >
                            Close
                        </Button>
                    </Flex>
                </Card>
            )}
        </div>
    );
}

