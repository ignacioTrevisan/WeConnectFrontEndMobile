import prompt from "react-native-prompt-android";

interface Props {
    title: string,
    message: string,
    buttons: Buttons[],
    type?: 'default' | 'plain-text' | 'secure-text',
    defaultValue?: string,
    placeholder?: string



}

interface Buttons {
    text: string,
    onPress: (value: string) => void,
    style?: "cancel" | "default" | "destructive"

}


// title?: string, message?: string, callbackOrButtons?: ((value: string) => void) | Array<PromptButton>, options?: PromptOptions): void
// import prompt 



export const PromptAdapter = ({ title, message, buttons, type = 'default', defaultValue, placeholder }: Props) => {
    prompt(
        title,
        message,
        buttons,
        { type, cancelable: false, defaultValue, placeholder }
    );
}