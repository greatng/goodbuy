import type { Route } from './+types/home';
import '@radix-ui/themes/styles.css';
import { Box, Container, Theme } from '@radix-ui/themes';
import ItemList from '../components/ItemList';
import { usePersistentState } from '../hooks/usePersistentState';
import GuideCard from '../components/GuideCard';
import '../i18n';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Goodbuy !, "Goodbye" to overpaying!' },
        { name: 'description', content: '"Goodbye" to overpaying!' },
    ];
}

export default function Home() {
    const [isDarkMode, setIsDarkMode] = usePersistentState(
        'is-dark-mode',
        true
    );

    return (
        <Theme
            appearance={isDarkMode ? 'dark' : 'light'}
            radius="large"
            accentColor="iris"
            panelBackground="translucent"
        >
            <Box minHeight={'100vh'} p="2">
                <Container size="1">
                    <GuideCard
                        isDarkMode={isDarkMode}
                        setIsDarkMode={setIsDarkMode}
                    />
                    <ItemList />
                </Container>
            </Box>
        </Theme>
    );
}

