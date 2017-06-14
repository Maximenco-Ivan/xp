module api.ui.text {

    import StringHelper = api.util.StringHelper;
    import NumberHelper = api.util.NumberHelper;
    import ArrayHelper = api.util.ArrayHelper;
    import i18n = api.util.i18n;

    enum CharType {
        SPECIAL,
        DIGIT,
        UPPERCASE,
        LOWERCASE
    }

    export class PasswordGenerator extends api.dom.FormInputEl {

        private input: PasswordInput;
        private showLink: api.dom.AEl;
        private generateLink: api.dom.AEl;
        private complexityHolder: api.dom.DivEl;

        private complexity: string;

        private focusListeners: {(event: FocusEvent):void}[] = [];

        private blurListeners: {(event: FocusEvent):void}[] = [];

        private SPECIAL_CHARS: string = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
        private LOWERCASE_CHARS: string = 'abcdefghijklmnopqrstuvwxyz';
        private UPPERCASE_CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        private DIGIT_CHARS: string = '0123456789';

        constructor() {
            super('div', 'password-generator');

            let inputWrapper = new api.dom.DivEl('input-wrapper');
            this.appendChild(inputWrapper);

            let strengthMeter = new api.dom.DivEl('strength-meter');
            inputWrapper.appendChild(strengthMeter);

            this.input = new PasswordInput();
            this.initFocusEvents(this.input);
            this.input.onInput((event: Event) => {
                this.assessComplexity(this.input.getValue());
                this.notifyValidityChanged(this.input.isValid());
            });
            inputWrapper.appendChild(this.input);

            this.showLink = new api.dom.AEl('show-link');
            this.showLink.appendChildren(
                new api.dom.SpanEl('show-link__show').setHtml(i18n('field.pswGenerator.show')),
                new api.dom.SpanEl('show-link__hide').setHtml(i18n('field.pswGenerator.hide'))
            );
            this.initFocusEvents(this.showLink);
            this.showLink.onClicked((event: MouseEvent) => {
                let unlocked = this.hasClass('unlocked');
                this.toggleClass('unlocked', !unlocked);
                this.input.setType(unlocked ? 'password' : 'text');
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            this.appendChild(this.showLink);

            this.generateLink = new api.dom.AEl();
            this.generateLink.setHtml(i18n('field.pswGenerator.generate'));
            this.initFocusEvents(this.generateLink);
            this.generateLink.onClicked((event: MouseEvent) => {
                this.generatePassword();
                this.assessComplexity(this.input.getValue());
                this.notifyValidityChanged(this.input.isValid());
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            this.appendChild(this.generateLink);

            this.complexityHolder = new api.dom.DivEl('complexity');
            inputWrapper.appendChild(this.complexityHolder);
        }

        doGetValue(): string {
            return this.input.getValue();
        }

        doSetValue(value: string, silent?: boolean): PasswordGenerator {
            this.input.setValue(value, silent);
            this.assessComplexity(value);
            return this;
        }

        getName(): string {
            return this.input.getName();
        }

        setName(value: string): PasswordGenerator {
            this.input.setName(value);
            return this;
        }

        setPlaceholder(value: string): PasswordGenerator {
            this.input.setPlaceholder(value);
            return this;
        }

        getPlaceholder(): string {
            return this.input.getPlaceholder();
        }

        private assessComplexity(value: string) {
            if (this.complexity) {
                this.removeClass(this.complexity);
                this.complexity = null;
                this.complexityHolder.setHtml('');
            }
            if (this.isExtreme(value)) {
                this.complexity = 'extreme';
            } else if (this.isStrong(value)) {
                this.complexity = 'strong';
            } else if (this.isGood(value)) {
                this.complexity = 'good';
            } else if (this.isWeak(value)) {
                this.complexity = 'weak';
            }
            if (this.complexity) {
                this.addClass(this.complexity);
                this.complexityHolder.setHtml(i18n(`field.pswGenerator.complexity.${this.complexity}`));
            }
        }

        private generatePassword() {
            let length = NumberHelper.randomBetween(14, 16);
            let maxSpecials = NumberHelper.randomBetween(1, 3);
            let specials = 0;
            let maxDigits = NumberHelper.randomBetween(2, 4);
            let digits = 0;
            let maxUppercase = NumberHelper.randomBetween(2, 4);
            let uppercase = 0;
            let maxLowercase = length - maxSpecials - maxDigits - maxUppercase;
            let lowercase = 0;

            let result = '';
            let types = [CharType.SPECIAL, CharType.DIGIT, CharType.UPPERCASE, CharType.LOWERCASE];

            for (let i = 0; i < length; i++) {
                let type = types[NumberHelper.randomBetween(0, types.length - 1)];
                switch (type) {
                case CharType.SPECIAL:
                    if (specials < maxSpecials) {
                        result += this.SPECIAL_CHARS.charAt(NumberHelper.randomBetween(0, this.SPECIAL_CHARS.length - 1));
                        specials++;
                    } else {
                        i--;
                        ArrayHelper.removeValue(CharType.SPECIAL, types);
                    }
                    break;
                case CharType.DIGIT:
                    if (digits < maxDigits) {
                        result += this.DIGIT_CHARS.charAt(NumberHelper.randomBetween(0, this.DIGIT_CHARS.length - 1));
                        digits++;
                    } else {
                        i--;
                        ArrayHelper.removeValue(CharType.DIGIT, types);
                    }
                    break;
                case CharType.UPPERCASE:
                    if (uppercase < maxUppercase) {
                        result += this.UPPERCASE_CHARS.charAt(NumberHelper.randomBetween(0, this.UPPERCASE_CHARS.length - 1));
                        uppercase++;
                    } else {
                        i--;
                        ArrayHelper.removeValue(CharType.UPPERCASE, types);
                    }
                    break;
                case CharType.LOWERCASE:
                    if (lowercase < maxLowercase) {
                        result += this.LOWERCASE_CHARS.charAt(NumberHelper.randomBetween(0, this.LOWERCASE_CHARS.length - 1));
                        lowercase++;
                    } else {
                        i--;
                        ArrayHelper.removeValue(CharType.LOWERCASE, types);
                    }
                    break;
                }
            }
            this.input.setValue(result);
        }

        private isWeak(value: string): boolean {
            return !StringHelper.isBlank(value) &&
                   (value.length < 8 || StringHelper.isLowerCase(value) || StringHelper.isUpperCase(value));
        }

        private isGood(value: string): boolean {
            return !StringHelper.isBlank(value) &&
                   (value.length >= 8 || (value.length >= 6 &&
                                          StringHelper.isMixedCase(value) &&
                                          this.containsNonAlphabetChars(value)));
        }

        private isStrong(value: string): boolean {
            return !StringHelper.isBlank(value) &&
                   value.length >= 10 &&
                   StringHelper.isMixedCase(value) &&
                   this.containsNonAlphabetChars(value);
        }

        private isExtreme(value: string): boolean {
            return !StringHelper.isBlank(value) &&
                   value.length >= 14 &&
                   StringHelper.isMixedCase(value) &&
                   this.containsDigits(value) &&
                   this.containsSpecialChars(value);

        }

        private containsDigits(value: string): boolean {
            return /\d/.test(value);
        }

        private containsSpecialChars(value: string): boolean {
            return /[^a-z0-9\s]/i.test(value);
        }

        private containsNonAlphabetChars(value: string): boolean {
            return /[^a-z\s]/i.test(value);
        }

        private initFocusEvents(el: api.dom.Element) {
            el.onFocus((event: FocusEvent) => {
                this.notifyFocused(event);
            });

            el.onBlur((event: FocusEvent) => {
                this.notifyBlurred(event);
            });
        }

        onInput(listener: (event: Event) => void) {
            this.input.onInput(listener);
        }

        unInput(listener: (event: Event) => void) {
            this.input.unInput(listener);
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.focusListeners.push(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.focusListeners = this.focusListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.blurListeners.push(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.blurListeners = this.blurListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        private notifyFocused(event: FocusEvent) {
            this.focusListeners.forEach((listener) => {
                listener(event);
            });
        }

        private notifyBlurred(event: FocusEvent) {
            this.blurListeners.forEach((listener) => {
                listener(event);
            });
        }

    }
}
