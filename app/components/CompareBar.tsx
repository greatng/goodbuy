'use client';

import { Button, Card, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import type { Item } from './ItemList';

type CompareBarProps = {
    selectedIndices: number[];
    items: Item[];
    clearSelection: () => void;
};

export default function CompareBar({
    selectedIndices,
    items,
    clearSelection,
}: CompareBarProps) {
    const [open, setOpen] = useState(false);

    const selectedItems = selectedIndices
        .map((i) => items[i])
        .filter(Boolean) as Item[];

    return (
        <>
            <Flex align="center" gap="2" className="compare-bar">
                <Text size="2">Selected items: {selectedIndices.length}</Text>
                <Button
                    onClick={() => setOpen(true)}
                    disabled={selectedIndices.length < 2}
                    aria-label={`Compare ${selectedIndices.length} selected items`}
                    title={`Compare ${selectedIndices.length} selected items`}
                >
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <span>Compare</span>
                    </span>
                </Button>
                <Button
                    variant="ghost"
                    onClick={clearSelection}
                    disabled={selectedIndices.length === 0}
                    aria-label="Clear selection"
                    title="Clear selection"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                    >
                        <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Button>
            </Flex>

            {open && (
                <div className="compare-modal-backdrop">
                    <Card className="compare-modal">
                        <Flex direction="column" gap="3">
                            <Flex justify="between" align="center">
                                <Text size="4">Price Comparison</Text>
                                <div>
                                    <Button onClick={() => setOpen(false)}>
                                        Close
                                    </Button>
                                </div>
                            </Flex>

                            <table className="compare-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Per Unit</th>
                                        <th>Price</th>
                                        <th>Shipping</th>
                                        <th>Volume</th>
                                        <th>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedItems.map((it, idx) => (
                                        <tr
                                            key={idx}
                                            className={
                                                it.isCheapest
                                                    ? 'item-card-cheapest'
                                                    : ''
                                            }
                                        >
                                            <td>
                                                {it.name ??
                                                    `Item ${selectedIndices[idx]}`}
                                            </td>
                                            <td>
                                                {it.per_unit?.toPrecision(4) ??
                                                    '-'}
                                            </td>
                                            <td>{it.price ?? '-'}</td>
                                            <td>{it.shipping ?? '-'}</td>
                                            <td>{it.volume ?? '-'}</td>
                                            <td>{it.qty ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Flex justify="end" gap="2">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setOpen(false);
                                        clearSelection();
                                    }}
                                >
                                    Close & Clear
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                </div>
            )}
        </>
    );
}

