document.getElementById("leftcontainer").innerHTML += Object.entries(x).map(([key, value]) => `<li><a href="#${key}">${key}</a></li>`).join('');

const container = document.getElementById("sortable-container");
let groupIndex = 1;

for (const [category, items] of Object.entries(x)) {
    // カテゴリタイトル
    const section = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = category;
    title.id = category;
    section.appendChild(title);

    for (const [label, prompt] of Object.entries(items)) {
        const holderId = `btn${groupIndex}-container`;
        const groupId = `btn${groupIndex}`;

        const holder = document.createElement("span");
        holder.className = "button-holder";
        holder.id = holderId;

        const group = document.createElement("span");
        group.className = "button-group";
        group.id = groupId;
        group.setAttribute("prompt", prompt);

        group.innerHTML = `
        <span class="group-label">${label}</span>
        <button onclick="mycopy('${prompt}')">⧉</button>
        <button class="btn-plus" onclick="movebutton('destination-container')">+</button>
        <button class="btn-minus" onclick="movebutton('${holderId}')">-</button>
      `;

        holder.appendChild(group);
        section.appendChild(holder);
        groupIndex++;
    }

    container.appendChild(section);
}

function mycopy(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log(`Copied: ${text}`);
        // ここでユーザー通知など追加可（例：トースト表示）
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function getPromptsInDestination() {
    const destination = document.getElementById('destination-container');
    const groups = destination.querySelectorAll('.button-group');

    const prompts = Array.from(groups)
        .map(group => group.getAttribute('prompt'))
        .filter(Boolean); // null や undefined を除外

    console.log(prompts.join(', '));
}

function copyPrompts() {
    const destination = document.getElementById('destination-container');
    const groups = destination.querySelectorAll('.button-group');

    const prompts = Array.from(groups)
        .map(group => group.getAttribute('prompt'))
        .filter(Boolean); // null や undefined を除外

    mycopy(prompts.join(', '));
}



function movebutton(destinationId) {
    const button = event.target;
    const buttonGroup = button.closest('.button-group');
    const destination = document.getElementById(destinationId);

    if (!buttonGroup || !destination) return;

    destination.appendChild(buttonGroup);

    // -ボタンを押したときだけ「戻し」フラグを追加
    if (button.classList.contains('btn-minus')) {
        buttonGroup.classList.add('returned');
    }
}
// 転送先：受け入れのみ許可、一方通行
Sortable.create(document.getElementById('destination-container'), {
    group: {
        name: 'shared',
        pull: true, // 取り出し可能（他から移動されてくるのはOK）
        put: ['button-holder'] // button-holder からのみ受け入れ可
    },
    animation: 150,
    ghostClass: 'sortable-ghost',
    dragClass: 'sortable-drag'
});

// 各戻り元（button-holder）：送信のみ許可、一方通行
document.querySelectorAll('.button-holder').forEach(container => {
    Sortable.create(container, {
        group: {
            name: 'button-holder',
            pull: true, // 出すのはOK
            put: false // 戻ってくるのはNG
        },
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag'
    });
});