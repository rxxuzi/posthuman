const redButtons :string[] = ['A', 'B', 'C', 'D', 'E'];
const greenButtons :string[] = ['1', '2', '3', '4', '5'];
const blueButtons :string[] = ['あ', 'い', 'う', 'え', 'お'];
let selectedButtons: string[] = [];

// 各ボタンセットの選択上限と下限を定義
const RED_BUTTON_LIMIT : {min : number, max : number} = { min: 1, max: 3 };
const GREEN_BUTTON_LIMIT: {min : number, max : number}  = { min: 2, max: 4 };
const BLUE_BUTTON_LIMIT: {min : number, max : number}  = { min: 1, max: 5 };

// 選択されたボタンの数を追跡する変数
let selectedRedButtons :number = 0;
let selectedGreenButtons: number = 0;
let selectedBlueButtons : number = 0;
let currentStage : string = 'red'; // 現在のステージを追跡

const isSelectionValid = () => {
    // 現在のステージに応じて選択数のチェック
    switch (currentStage) {
        case 'red':
            return selectedRedButtons >= RED_BUTTON_LIMIT.min && selectedRedButtons < RED_BUTTON_LIMIT.max;
        case 'green':
            return selectedGreenButtons >= GREEN_BUTTON_LIMIT.min && selectedGreenButtons < GREEN_BUTTON_LIMIT.max;
        case 'blue':
            return selectedBlueButtons >= BLUE_BUTTON_LIMIT.min && selectedBlueButtons < BLUE_BUTTON_LIMIT.max;
        default:
            return false; // 未知のステージの場合は無効
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) throw new Error('buttonContainer not found');

    const addButtons = (buttonValues: string[], color: string) => {
        buttonContainer.innerHTML = '';
        buttonValues.forEach(value => {
            const button = document.createElement('button');
            button.textContent = value;
            button.classList.add('circle-button', color);
            button.addEventListener('click', () => toggleButton(button, color));
            buttonContainer.appendChild(button);
        });
    };

    // ボタンの状態を切り替える関数
    const toggleButton = (button: HTMLButtonElement, color: string) => {
        const value = button.textContent;
        const isSelected = button.classList.contains('active');
        if (isSelected) {
            button.classList.remove('active');
            decBtn(color);
            selectedButtons = selectedButtons.filter(btn => btn !== value); // 選択解除
        } else {
            if (canSelectMore(color)) {
                button.classList.add('active');
                incBtn(color);
                if (value != null) selectedButtons.push(value); // 選択
            }
        }
        updateNextButtonStyle(); // NEXTボタンのスタイルを更新
        console.log('Selected Buttons:', selectedButtons); // デバッグ用のログ
    };

    const updateNextButtonStyle = () => {
        const nextButton = document.getElementById('next');
        if (!nextButton) return;

        if (isSelectionValid()) {
            nextButton.classList.remove('disabled');
            nextButton.style.backgroundColor = ''; // 通常の背景色
        } else {
            nextButton.classList.add('disabled');
            nextButton.style.backgroundColor = 'grey'; // 無効化時の背景色
        }
    };

    // "NEXT"ボタンの設定
    const nextButton = document.getElementById('next');
    if (!nextButton) throw new Error('nextButton not found');

    nextButton.textContent = 'NEXT';
    nextButton.classList.remove('post');
    nextButton.addEventListener('click', () => {
        if(isSelectionValid()) {
            if (buttonContainer.querySelector('.red')) {
                currentStage = 'green';
                addButtons(greenButtons, 'green');
            } else if (buttonContainer.querySelector('.green')) {
                currentStage = 'blue';
                addButtons(blueButtons, 'blue');
                nextButton.textContent = 'POST';
                nextButton.classList.add('post');
                nextButton.addEventListener('click', () => {
                    alert('Selected buttons: ' + selectedButtons.join(', '));
                });
            }
        }

        console.log("Red : " + selectedRedButtons + ", Green : " + selectedGreenButtons + ", Blue :" + selectedBlueButtons );
        updateNextButtonStyle();
    });

    // 新規選択が可能かを判断する関数
    const canSelectMore = (color: string) => {
        switch (color) {
            case 'red':
                return selectedRedButtons < RED_BUTTON_LIMIT.max;
            case 'green':
                return selectedGreenButtons < GREEN_BUTTON_LIMIT.max;
            case 'blue':
                return selectedBlueButtons < BLUE_BUTTON_LIMIT.max;
            default:
                return false;
        }
    };

// 選択されたボタンの数を増やす関数
    const incBtn = (color: string) => {
        switch (color) {
            case 'red':
                selectedRedButtons++;
                break;
            case 'green':
                selectedGreenButtons++;
                break;
            case 'blue':
                selectedBlueButtons++;
                break;
        }
    };

// 選択されたボタンの数を減らす関数
    const decBtn = (color: string) => {
        switch (color) {
            case 'red':
                selectedRedButtons--;
                break;
            case 'green':
                selectedGreenButtons--;
                break;
            case 'blue':
                selectedBlueButtons--;
                break;
        }
    };

    // 初期の赤いボタンを追加
    addButtons(redButtons, 'red');
    updateNextButtonStyle(); // 初期状態でNEXTボタンのスタイルを更新
});


