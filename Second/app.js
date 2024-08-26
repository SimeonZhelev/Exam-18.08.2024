window.addEventListener("load", solve);

function solve() {
    const addBtn = document.getElementById('add-btn');
    const nameInput = document.getElementById('name');
    const timeInput = document.getElementById('time');
    const descriptionInput = document.getElementById('description');
    const previewList = document.getElementById('preview-list');
    const archiveList = document.getElementById('archive-list');

    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const time = timeInput.value.trim();
        const description = descriptionInput.value.trim();

        if (name && time && description) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <article>
                    <p>${name}</p>
                    <p>${time}</p>
                    <p>${description}</p>
                </article>
                <button class="edit-btn">Edit</button>
                <button class="next-btn">Next</button>
            `;

            previewList.appendChild(listItem);

            nameInput.value = '';
            timeInput.value = '';
            descriptionInput.value = '';

            addBtn.disabled = true;

            listItem.querySelector('.edit-btn').addEventListener('click', () => {
                const article = listItem.querySelector('article');
                const [namePara, timePara, descriptionPara] = article.querySelectorAll('p');

                if (namePara && timePara && descriptionPara) {
                    nameInput.value = namePara.textContent;
                    timeInput.value = timePara.textContent;
                    descriptionInput.value = descriptionPara.textContent;

                    previewList.removeChild(listItem);
                    addBtn.disabled = false;
                } else {
                    console.error('Error: Unable to find paragraph elements in the list item.');
                }
            });

            listItem.querySelector('.next-btn').addEventListener('click', () => {
                const article = listItem.querySelector('article');
                const [namePara, timePara, descriptionPara] = article.querySelectorAll('p');

                if (namePara && timePara && descriptionPara) {
                    const archiveItem = document.createElement('li');
                    archiveItem.innerHTML = `
                        <article>
                            <p>${namePara.textContent}</p>
                            <p>${timePara.textContent}</p>
                            <p>${descriptionPara.textContent}</p>
                        </article>
                        <button class="archive-btn">Archive</button>
                    `;

                    archiveList.appendChild(archiveItem);
                    previewList.removeChild(listItem);

                    archiveItem.querySelector('.archive-btn').addEventListener('click', () => {
                        archiveList.removeChild(archiveItem);
                        addBtn.disabled = false;
                    });
                } else {
                    console.error('Error: Unable to find paragraph elements in the list item.');
                }
            });
        } else {
            console.error('Error: All input fields must be filled out.');
        }
    });
}
