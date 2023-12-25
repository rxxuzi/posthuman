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
function createButtons(container: HTMLElement, options: string[], onClick: (option: string) => void, incompatibleOptions: string[] = []) {
    container.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => onClick(option));
        if (!incompatibleOptions.includes(option)) {
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
function selectType(type: string) {
    selectedType = type;
    const filteredFruits = Object.values(fruits).filter(fruit => fruit.type === type);
    const times = Array.from(new Set(filteredFruits.flatMap(fruit => fruit.time)));
    createButtons(timeSelection, times, selectTime);
}

// Time を選択した際の処理
function selectTime(time: string) {
    selectedTime = time;
    const filteredFruits = Object.values(fruits).filter(fruit => fruit.time.includes(time));
    const features = Array.from(new Set(filteredFruits.flatMap(fruit => fruit.feature)));
    createButtons(featureSelection, features, selectFeature);
}

// Feature を選択した際の処理
function selectFeature(feature: string) {
    if (selectedFeatures.has(feature)) {
        selectedFeatures.delete(feature); // 選択解除
    } else {
        selectedFeatures.add(feature); // 選択
    }
    updateFeatureButtons();
    updateNextButtonVisibility();
}

// Feature ボタンを更新する関数
function updateFeatureButtons() {
    const allFeatures = Array.from(new Set(Object.values(fruits).flatMap(fruit => fruit.feature)));
    const incompatibleFeatures = selectedFeatures.size > 0
        ? allFeatures.filter(f => !selectedFeatures.has(f))
        : [];
    createButtons(featureSelection, allFeatures, selectFeature, incompatibleFeatures);
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
function onFeatureNext() {
    displayTags();
}

// タグを表示する関数
function displayTags() {
    const tags = Object.keys(fruits)
        .filter(key =>
            fruits[key].type === selectedType &&
            selectedTime !== null && fruits[key].time.includes(selectedTime) &&
            Array.from(selectedFeatures).every(feature => fruits[key].feature.includes(feature))
        );
    createButtons(selectedTags, tags, selectTag);
}

// タグを選択した際の処理
function selectTag(tag: string) {
    if (selections.includes(tag)) {
        selections = selections.filter(t => t !== tag); // 選択解除
    } else {
        selections.push(tag); // 選択
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


