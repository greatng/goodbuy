'use client';

import { Card, Flex, Text, Button } from '@radix-ui/themes';
import type { Item } from './ItemList';
import { useState, useMemo } from 'react';

function IconStar() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
        >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

export default function Top3Dialog({
    items,
    inline,
}: {
    items: Item[];
    inline?: boolean;
}) {
    const [open, setOpen] = useState(false);

    const top3 = useMemo(() => {
        const values = items.map((it) => Number(it.per_unit) || Infinity);
        const sorted = values
            .map((v, i) => ({ v, i }))
            .filter((s) => isFinite(s.v))
            .sort((a, b) => a.v - b.v)
            .slice(0, 3);
        return sorted.map((s) => ({
            index: s.i,
            item: items[s.i],
            value: s.v,
        }));
    }, [items]);

    if (!open) {
        const cls = inline ? 'top3-inline' : 'top3-closed';
        return (
            <div className={cls}>
                <Button
                    onClick={() => setOpen(true)}
                    disabled={top3.length === 0}
                    aria-label="Show top 3 best deals"
                    title="Show top 3 best deals"
                >
                    <IconStar />
                    <span>Top 3</span>
                </Button>
            </div>
        );
    }

    if (top3.length === 0) {
        return (
            <div className="top3-dialog">
                <Card>
                    <Flex direction="column" gap="2">
                        <Flex justify="between" align="center">
                            <Flex gap="2" align="center">
                                <IconStar />
                                <Text size="3">Top 3 Best Deals</Text>
                            </Flex>
                            <Button
                                variant="ghost"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </Button>
                        </Flex>
                        <Text size="2">
                            No computed unit prices available yet.
                        </Text>
                    </Flex>
                </Card>
            </div>
        );
    }

    return (
        <div className="top3-dialog">
            <Card>
                <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                        <Flex gap="2" align="center">
                            <IconStar />
                            <Text size="3">Top 3 Best Deals</Text>
                        </Flex>
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </Flex>

                    {top3.map((t, i) => (
                        <Flex
                            key={t.index}
                            justify="between"
                            align="center"
                            className={`top3-row top3-rank-${i + 1}`}
                        >
                            <div>
                                <Text size="2">
                                    {t.item.name || `Item ${t.index + 1}`}
                                </Text>
                                <Text size="1">
                                    Unit price:{' '}
                                    {isFinite(t.value)
                                        ? t.value.toPrecision(4)
                                        : '-'}
                                </Text>
                            </div>
                            <div>
                                <Text size="2">#{i + 1}</Text>
                            </div>
                        </Flex>
                    ))}
                </Flex>
            </Card>
        </div>
    );
}

