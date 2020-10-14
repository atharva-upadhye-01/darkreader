import {m} from 'malevic';
import {DEFAULT_SETTINGS, DEFAULT_THEME, DEFAULT_COLORS} from '../../../../defaults';
import {Theme} from '../../../../definitions';
import {ViewProps} from '../../types';
import {BackgroundColor, Brightness, Contrast, FontPicker, Grayscale, Mode, ResetButton, Scheme, Scrollbar, SelectionColorEditor, Sepia, TextColor, TextStroke, UseFont, StyleSystemControls} from '../controls';
import ThemePresetPicker from '../preset-picker';
import {getCurrentThemePreset} from '../utils';
import Collapsible from './collapsible-panel';
import {COLOR_SCHEMES, DARK_COLOR_SCHEME, LIGHT_COLOR_SCHEME} from '../../../../colorScheme';
import ColorSchemeDropDown from '../controls/color-scheme';

interface ThemeGroupProps {
    theme: Theme;
    change: (theme: Partial<Theme>) => void;
}

function MainGroup({theme, change}: ThemeGroupProps) {
    return (
        <Array>
            <Brightness
                value={theme.brightness}
                onChange={(v) => change({brightness: v})}
            />
            <Contrast
                value={theme.contrast}
                onChange={(v) => change({contrast: v})}
            />
            <Sepia
                value={theme.sepia}
                onChange={(v) => change({sepia: v})}
            />
            <Grayscale
                value={theme.grayscale}
                onChange={(v) => change({grayscale: v})}
            />
            <Scheme
                isDark={theme.mode === 1}
                onChange={(isDark) => change({mode: isDark ? 1 : 0})}
            />
            <Mode
                mode={theme.engine}
                onChange={(mode) => change({engine: mode})}
            />
        </Array>
    );
}

function ColorsGroup({theme, change}: ThemeGroupProps) {
    const isDarkScheme = theme.mode === 1;
    const csProp: keyof Theme = isDarkScheme ? 'darkColorScheme' : 'lightColorScheme';
    const bgProp: keyof Theme = isDarkScheme ? 'darkSchemeBackgroundColor' : 'lightSchemeBackgroundColor';
    const fgProp: keyof Theme = isDarkScheme ? 'darkSchemeTextColor' : 'lightSchemeTextColor';
    const defaultSchemeColors = isDarkScheme ? DEFAULT_COLORS.darkScheme : DEFAULT_COLORS.lightScheme;
    const defaultMatrixValues: Partial<Theme> = {brightness: DEFAULT_THEME.brightness, contrast: DEFAULT_THEME.contrast, sepia: DEFAULT_THEME.sepia, grayscale: DEFAULT_THEME.grayscale};
    const currentColorScheme = isDarkScheme ? theme.darkColorScheme : theme.lightColorScheme;
    const colorSchemeValues: string[] = (isDarkScheme ? DARK_COLOR_SCHEME : LIGHT_COLOR_SCHEME).sort((a, b) => a.localeCompare(b)) ;

    function onColorSchemeChange(newColor: string) {
        change({[csProp]: newColor});
        change({[bgProp]: COLOR_SCHEMES[newColor].background});
        change({[fgProp]: COLOR_SCHEMES[newColor].text});
    }

    return (
        <Array>
            <BackgroundColor
                value={theme[bgProp] === 'auto' ? defaultSchemeColors.background : theme[bgProp]}
                onChange={(v) => change({[bgProp]: v, ...defaultMatrixValues})}
                canReset={theme[bgProp] !== defaultSchemeColors.background}
                onReset={() => change({[bgProp]: DEFAULT_SETTINGS.theme[bgProp]})}
            />
            <TextColor
                value={theme[fgProp] === 'auto' ? defaultSchemeColors.text : theme[fgProp]}
                onChange={(v) => change({[fgProp]: v, ...defaultMatrixValues})}
                canReset={theme[fgProp] !== defaultSchemeColors.text}
                onReset={() => change({[fgProp]: DEFAULT_SETTINGS.theme[fgProp]})}
            />
            <Scrollbar
                value={theme.scrollbarColor}
                onChange={(v) => change({scrollbarColor: v})}
                onReset={() => change({scrollbarColor: DEFAULT_SETTINGS.theme.scrollbarColor})}
            />
            <SelectionColorEditor
                value={theme.selectionColor}
                onChange={(v) => change({selectionColor: v})}
                onReset={() => change({selectionColor: DEFAULT_SETTINGS.theme.selectionColor})}
            />
            <ColorSchemeDropDown
                selected={currentColorScheme}
                values={colorSchemeValues}
                onChange={(v) => onColorSchemeChange(v)}
            />
        </Array>
    );
}

interface FontGroupsProps extends ThemeGroupProps {
    fonts: string[];
}

function FontGroup({theme, fonts, change}: FontGroupsProps) {
    return (
        <Array>
            <UseFont
                value={theme.useFont}
                onChange={(useFont) => change({useFont})}
            />
            <FontPicker
                theme={theme}
                fonts={fonts}
                onChange={(fontFamily) => change({fontFamily})}
            />
            <TextStroke
                value={theme.textStroke}
                onChange={(textStroke) => change({textStroke})}
            />
            <StyleSystemControls
                value={theme.styleSystemControls}
                onChange={(styleSystemControls) => change({styleSystemControls})}
            />
        </Array>
    );
}

export default function ThemePage(props: ViewProps) {
    const {theme, change} = getCurrentThemePreset(props);

    return (
        <section class="m-section theme-page">
            <ThemePresetPicker {...props} />
            <Collapsible>
                <Collapsible.Group id="main" label="Brightness, contrast, mode">
                    <MainGroup theme={theme} change={change} />
                </Collapsible.Group>
                <Collapsible.Group id="colors" label="Colors">
                    <ColorsGroup theme={theme} change={change} />
                </Collapsible.Group>
                <Collapsible.Group id="font" label="Font & more">
                    <FontGroup theme={theme} fonts={props.data.fonts} change={change} />
                </Collapsible.Group>
            </Collapsible>
            <ResetButton {...props} />
        </section>
    );
}
