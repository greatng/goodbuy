'use client';

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import {
    Button,
    Card,
    Dialog,
    Flex,
    IconButton,
    Separator,
    Switch,
    Text,
} from '@radix-ui/themes';
import LangDropdown from './LangDropdown';
import { useTranslation } from 'react-i18next';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { type TFunction } from 'i18next';

function InstructionDialog({ t }: { t: TFunction }) {
    const [page, setPage] = useState(1);

    const handlePageChange = (direction: 'next' | 'back') => {
        setPage((prev) => {
            if (direction === 'next') {
                return prev + 1;
            } else return prev - 1;
        });
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <QuestionMarkCircledIcon width="24px" height="24px" />
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px" minHeight="250px">
                <Dialog.Title size="2">{t('instructions.title')}</Dialog.Title>
                <Dialog.Description size="1" mb="4">
                    {t('instructions.description')}
                </Dialog.Description>
                <Separator my="1" size="4" />

                <Flex>
                    <Flex direction="column" minHeight="100px">
                        <Dialog.Description size="2" weight="bold" mb="2">
                            {page}: {t(`instructions.steps.step_${page}.title`)}
                        </Dialog.Description>
                        <Dialog.Description size="2">
                            {t(`instructions.steps.step_${page}.details`)}
                        </Dialog.Description>
                    </Flex>
                </Flex>

                <Flex gap="2" mt="4" justify="between">
                    <Flex gap="2" align="center">
                        <IconButton
                            disabled={page <= 1}
                            onClick={() => handlePageChange('back')}
                        >
                            <ArrowLeftIcon
                                width="24px"
                                height="24px"
                            ></ArrowLeftIcon>
                        </IconButton>

                        <IconButton
                            disabled={page >= 6}
                            onClick={() => handlePageChange('next')}
                        >
                            <ArrowRightIcon
                                width="24px"
                                height="24px"
                            ></ArrowRightIcon>
                        </IconButton>
                    </Flex>
                    <Dialog.Close>
                        <Button variant="soft" onClick={() => setPage(1)}>
                            {t('Close')}
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}

function GuideCard({
    isDarkMode,
    setIsDarkMode,
}: {
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}) {
    const { t } = useTranslation();

    return (
        <Card my="4">
            <Flex justify={'between'} align={'center'}>
                <Text size="1" as="label">
                    <Flex gap="2">
                        <Switch
                            variant="soft"
                            defaultChecked={isDarkMode}
                            onClick={() => {
                                setIsDarkMode((prev) => !prev);
                            }}
                        />
                        {t('Toggle Dark Mode')}
                    </Flex>
                </Text>
                <Flex gap="2" align="center">
                    <LangDropdown />
                    <InstructionDialog t={t} />
                </Flex>
            </Flex>
        </Card>
    );
}

export default GuideCard;

