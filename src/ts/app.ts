type FruitData = {
    type: string;
    time: string[];
    feature: string[];
};

// Elements
const typeSelection = document.getElementById('typeSelection') as HTMLElement;
const timeSelection = document.getElementById('timeSelection') as HTMLElement;
const featureSelection = document.getElementById('featureSelection') as HTMLElement;
const selectedTags = document.getElementById('selectedTags') as HTMLElement;
const nextButton = document.getElementById('nextButton') as HTMLElement;

let selectedType: string | null = null;
let selectedTime: string | null = null;
let selectedFeatures: Set<string> = new Set();
let selections: string[] = []; // 選択されたタグの配列
let fruits: { [key: string]: FruitData };

// データを非同期で読み込む
fetch('./data/dummy.json')
    .then(response => response.json())
    .then((fruitsData: { [key: string]: FruitData }) => {
        fruits = fruitsData;
        initializeTypeButtons(fruits);
    });

// ボタンを動的に生成する関数
function createButtons(container: HTMLElement, options: string[], onClick: (option: string, button: HTMLButtonElement) => void) {
    container.innerHTML = '';
    options.forEach(option => {
        if (option) { // 空のオプションを排除するチェックを追加
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => onClick(option, button));
            container.appendChild(button);
        }
    });
}

// 選択されたボタンに .selected クラスを追加する関数
function updateSelectedClass(container: HTMLElement, selectedButton: HTMLButtonElement) {
    container.querySelectorAll('button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
}

// typeSelection ボタンの初期化
function initializeTypeButtons(fruits: { [key: string]: FruitData }) {
    const types = Array.from(new Set(Object.values(fruits).map(fruit => fruit.type)));
    createButtons(typeSelection, types, selectType);
}

// Type を選択した際の処理
function selectType(type: string, button: HTMLButtonElement) {
    selectedType = type;
    updateSelectedClass(typeSelection, button);
    const filteredFruits = Object.values(fruits).filter(fruit => fruit.type === type);
    const times = Array.from(new Set(filteredFruits.flatMap(fruit => fruit.time)));
    createButtons(timeSelection, times, selectTime);
}

// Time を選択した際の処理
function selectTime(time: string, button : HTMLButtonElement) {
    selectedTime = time;
    updateSelectedClass(timeSelection, button);
    const filteredFruits = Object.values(fruits).filter(fruit => fruit.time.includes(time));
    const features = Array.from(new Set(filteredFruits.flatMap(fruit => fruit.feature)));
    createButtons(featureSelection, features, selectFeature);
}

// Feature を選択した際の処理
//TODO : Featureが選択解除されたときのロジックの修正 NEXTに進めないバグ
function selectFeature(feature: string, button : HTMLButtonElement) {
    if (selectedFeatures.has(feature)) {
        selectedFeatures.delete(feature);
        button.classList.remove('selected'); // 選択解除時にクラスを削除
    } else {
        selectedFeatures.add(feature);
        button.classList.add('selected'); // 選択時にクラスを追加
    }

    console.log("Selected Features:", Array.from(selectedFeatures));

    updateFeatureButtons();
    updateNextButtonVisibility();
}

// Feature ボタンを更新する関数
function updateFeatureButtons() {
    // 選択された type と time に合致するフルーツのみをフィルタリング
    const filteredFruits = Object.values(fruits).filter(fruit =>
        selectedType !== null && selectedTime !== null &&
        fruit.type === selectedType && fruit.time.includes(selectedTime)
    );

    // 初回のみ feature ボタンを生成
    if (featureSelection.innerHTML === '') {
        const availableFeatures = Array.from(new Set(filteredFruits.flatMap(fruit => fruit.feature)));
        createButtons(featureSelection, availableFeatures, selectFeature);
    }
}

// Next ボタンの表示を更新する関数
function updateNextButtonVisibility() {
    if (selectedFeatures.size > 0) {
        nextButton.style.display = 'block';
        nextButton.addEventListener('click', onFeatureNext);
    } else {
        nextButton.style.display = 'none';
    }
}

// Feature の Next ボタンを押した際の処理
// FIXME
function onFeatureNext() {
    displayTags();
}

// タグを表示する関数
function displayTags() {
    const tags = Object.keys(fruits)
        .filter(key =>
            fruits[key].type === selectedType &&
            selectedTime !== null && fruits[key].time.includes(selectedTime!) &&
            Array.from(selectedFeatures).every(feature => fruits[key].feature.includes(feature))
        );
    createButtons(selectedTags, tags, selectTag);
}

// タグを選択した際の処理
function selectTag(tag: string, button : HTMLButtonElement) {
    if (selections.includes(tag)) {
        selections = selections.filter(t => t !== tag);
        button.classList.remove('selected'); // クラスを削除
    } else {
        selections.push(tag);
        button.classList.add('selected'); // クラスを追加
    }
    updateFinalNextButtonVisibility();
}

// 最終的な Next ボタンの表示を更新する関数
function updateFinalNextButtonVisibility() {
    if (selections.length > 0) {
        nextButton.style.display = 'block';
        nextButton.removeEventListener('click', onFeatureNext);
        nextButton.addEventListener('click', onFinalNext);
    } else {
        nextButton.style.display = 'none';
    }
}

// 最終的な Next ボタンを押した際の処理
function onFinalNext() {
    alert(`Selected: ${selections.join(', ')}`);
}


