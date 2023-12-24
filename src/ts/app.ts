type FruitData = {
    type: string;
    time: string[];
    feature: string[];
};

// Elements
const typeSelection = document.getElementById('typeSelection');
const timeSelection = document.getElementById('timeSelection');
const featureSelection = document.getElementById('featureSelection');
const nextButton = document.getElementById('nextButton');
const selectedTags = document.getElementById('selectedTags');

let selectedType: string | null = null;
let selectedTime: string | null = null;
let selectedFeatures: Set<string> = new Set();
let selections: string[] = []; // 選択された項目の配列
let tagSelections: string[] = []; // 選択されたタグの配列

// データを非同期で読み込む
fetch('./data/dummy.json')
    .then(response => response.json())
    .then((fruits: { [key: string]: FruitData }) => {
        initializeApp(fruits);
    });

function initializeApp(fruits: { [key: string]: FruitData }) {
    // Type ボタンのイベントリスナー
    typeSelection?.addEventListener('click', (event) => {
        if (event.target instanceof HTMLButtonElement && selectedType !== event.target.id) {
            console.log("Type button clicked:", event.target.id);
            selectedType = event.target.id === 'typeE' ? 'E' : 'O';
            selections = [selectedType]; // 選択をリセットして新しいタイプを配列に追加
            timeSelection!.style.display = 'block';
            nextButton!.style.display = 'none';
        }
    });

    // Time ボタンのイベントリスナー
    timeSelection?.addEventListener('click', (event) => {
        if (event.target instanceof HTMLButtonElement && selectedTime !== event.target.id) {
            console.log("Time button clicked:", event.target.id);
            selectedTime = event.target.id.replace('time', '').toLowerCase();
            selections.push(selectedTime); // Time を配列に追加
            updateFeatureButtons(fruits);
            featureSelection!.style.display = 'block';
        }
    });

    // Feature ボタンの更新処理
    function updateFeatureButtons(fruits: { [key: string]: FruitData }) {
        featureSelection!.innerHTML = '';
        let features = new Set<string>();
        for (const fruit in fruits) {
            if (fruits[fruit].type === selectedType && fruits[fruit].time.includes(selectedTime!)) {
                fruits[fruit].feature.forEach(feature => features.add(feature));
            }
        }
        features.forEach(feature => {
            const button = document.createElement('button');
            button.textContent = feature;
            button.addEventListener('click', () => selectFeature(feature));
            featureSelection!.appendChild(button);
        });
    }

    // Feature の選択処理
    function selectFeature(feature: string) {
        console.log("Feature button clicked:", feature);
        if (selectedFeatures.has(feature)) {
            selectedFeatures.delete(feature);
            selections.splice(selections.indexOf(feature), 1); // Feature を配列から削除
        } else {
            selectedFeatures.add(feature);
            selections.push(feature); // Feature を配列に追加
        }
        nextButton!.style.display = 'block';
    }

    function selectTag(tag: string, event: Event) {
        console.log("Tag button clicked:", tag);
        const clickedButton = event.target as HTMLButtonElement; // クリックされたボタンを取得
        if (!tagSelections.includes(tag)) {
            tagSelections.push(tag); // タグを配列に追加
            clickedButton.classList.add('selected'); // 押されたボタンに 'selected' クラスを追加
        }
        console.log("Tag selections:", tagSelections);
        if (tagSelections.length > 0) {
            nextButton!.style.display = 'block'; // タグが1つ以上選択されたら NEXT ボタンを表示
        }
    }

    // NEXTボタンのイベントリスナー
    nextButton?.addEventListener('click', () => {
        console.log("NEXT button clicked");
        if (tagSelections.length > 0) {
            alert(`選択されたタグ: ${tagSelections.join(', ')} , ${selections.join(', ')}`); // タグ選択時のみアラート表示
            tagSelections = []; // タグ選択をリセット
        } else {
            updateSelectedTags(fruits); // 通常のタグ更新処理
        }
        nextButton!.style.display = 'none';
    });

    // 選択されたタグの表示更新
    function updateSelectedTags(fruits: { [key: string]: FruitData }) {
        selectedTags!.innerHTML = '';
        let matchingFruits = new Set<string>();
        for (const fruit in fruits) {
            if (fruits[fruit].type === selectedType && fruits[fruit].time.includes(selectedTime!)) {
                let allFeaturesMatch = Array.from(selectedFeatures).every(feature => fruits[fruit].feature.includes(feature));
                if (allFeaturesMatch) {
                    matchingFruits.add(fruit);
                }
            }
        }
        matchingFruits.forEach(fruit => {
            const tagButton = document.createElement('button');
            tagButton.textContent = fruit;
            tagButton.classList.add('tagButton');
            tagButton.addEventListener('click', (event) => selectTag(fruit, event));
            selectedTags!.appendChild(tagButton);
        });
    }
}

