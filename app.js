const form = document.getElementById('form');
const addInputButton = document.getElementById('add-input');
const addSelectButton = document.getElementById('add-select');
const addTextareaButton = document.getElementById('add-textarea');
const saveButton = document.getElementById('save-form');

const inputFieldsDiv = document.getElementById('input-fields');
const selectFieldsDiv = document.getElementById('select-fields');
const textareaFieldsDiv = document.getElementById('textarea-fields');

const cancelInputButton = document.getElementById('cancel-input');
const cancelSelectButton = document.getElementById('cancel-select');
const cancelTextareaButton = document.getElementById('cancel-textarea');

const addInputElementButton = document.getElementById('add-input-element');
const addSelectElementButton = document.getElementById('add-select-element');
const addTextareaElementButton = document.getElementById('add-textarea-element');

const editModal = document.getElementById('edit-modal');
const editLabelInput = document.getElementById('edit-label');
const editPlaceholderInput = document.getElementById('edit-placeholder');
const editOptionsInput = document.getElementById('edit-options');
const cancelEditButton = document.getElementById('cancel-edit');
const saveEditButton = document.getElementById('save-edit');

let formElements = [];
let currentEditingElement = null;

const sampleData = [
    {
        id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
        type: "input",
        label: "Sample Label",
        placeholder: "Sample placeholder"
    },
    {
        id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
        type: "select",
        label: "Sample Label",
        options: ["Sample Option", "Sample Option", "Sample Option"]
    },
    {
        id: "45002ecf-85cf-4852-bc46-529f94a758f5",
        type: "input",
        label: "Sample Label",
        placeholder: "Sample Placeholder"
    },
    {
        id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
        type: "textarea",
        label: "Sample Label",
        placeholder: "Sample Placeholder"
    }
];

function renderForm() {
    form.innerHTML = '';
    formElements.forEach(element => {
        const formElement = document.createElement('div');
        formElement.classList.add('form-element');
        formElement.setAttribute('draggable', true);
        formElement.dataset.id = element.id;

        formElement.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', element.id);
            setTimeout(() => {
                formElement.classList.add('invisible');
            }, 0);
        };

        formElement.ondragend = () => {
            formElement.classList.remove('invisible');
        };

        formElement.ondragover = (e) => {
            e.preventDefault();
            formElement.classList.add('drag-over');
        };

        formElement.ondragleave = () => {
            formElement.classList.remove('drag-over');
        };

        formElement.ondrop = (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedIndex = formElements.findIndex(el => el.id === draggedId);
            const targetIndex = formElements.findIndex(el => el.id === element.id);

            if (draggedIndex !== targetIndex) {
                const [draggedElement] = formElements.splice(draggedIndex, 1);
                formElements.splice(targetIndex, 0, draggedElement);
                renderForm();
            }
            formElement.classList.remove('drag-over');
        };

        const label = document.createElement('label');
        label.innerText = element.label;
        formElement.appendChild(label);

        let input;
        if (element.type === 'input') {
            input = document.createElement('input');
            input.placeholder = element.placeholder;
        } else if (element.type === 'select') {
            input = document.createElement('select');
            element.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.innerText = option;
                input.appendChild(opt);
            });
        } else if (element.type === 'textarea') {
            input = document.createElement('textarea');
            input.placeholder = element.placeholder;
        }

        formElement.appendChild(input);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="fa fa-trash"></i>';
        removeButton.classList.add('action-button', 'remove-button');
        removeButton.onclick = () => {
            formElements = formElements.filter(el => el.id !== element.id);
            showToast('Element deleted successfully!');
            renderForm();
        };
        buttonContainer.appendChild(removeButton);

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-edit"></i>';
        editButton.classList.add('action-button', 'edit-button');
        editButton.onclick = (e) => {
            e.preventDefault();
            openEditModal(element);
        };
        buttonContainer.appendChild(editButton);

        formElement.appendChild(buttonContainer);
        form.appendChild(formElement);
    });
}

function openEditModal(element) {
    currentEditingElement = element;
    editLabelInput.value = element.label;

    if (element.type === 'input' || element.type === 'textarea') {
        editPlaceholderInput.classList.remove('model-hidden');
        editOptionsInput.classList.add('model-hidden');
        editPlaceholderInput.value = element.placeholder;
    } else if (element.type === 'select') {
        editPlaceholderInput.classList.add('model-hidden');
        editOptionsInput.classList.remove('model-hidden');
        editOptionsInput.value = element.options.join(',');
    }

    editModal.classList.remove('model-hidden');
}

cancelEditButton.onclick = () => {
    editModal.classList.add('model-hidden');
};

saveEditButton.onclick = () => {
    if (currentEditingElement) {
        currentEditingElement.label = editLabelInput.value;

        if (currentEditingElement.type === 'input' || currentEditingElement.type === 'textarea') {
            currentEditingElement.placeholder = editPlaceholderInput.value;
        } else if (currentEditingElement.type === 'select') {
            currentEditingElement.options = editOptionsInput.value.split(',');
        }

        showToast('Element updated successfully!');
        editModal.classList.add('model-hidden');
        renderForm();
    }
};

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
}

function addElement(type, label, placeholder, options = null) {
    if (!label || (type === 'input' && !placeholder) || (type === 'select' && (!options || options.length === 0)) || (type === 'textarea' && !placeholder)) {
        showToast('Please fill out all fields!');
        return;
    }

    const newElement = {
        id: Date.now().toString(),
        type: type,
        label: label,
        placeholder: type === 'select' ? null : placeholder,
        options: type === 'input' || type === 'textarea' ? null : options
    };
    formElements.push(newElement);
    renderForm();
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
}

addInputButton.onclick = () => {
    inputFieldsDiv.classList.remove('hidden');
    selectFieldsDiv.classList.add('hidden');
    textareaFieldsDiv.classList.add('hidden');
};

addSelectButton.onclick = () => {
    selectFieldsDiv.classList.remove('hidden');
    inputFieldsDiv.classList.add('hidden');
    textareaFieldsDiv.classList.add('hidden');
};

addTextareaButton.onclick = () => {
    textareaFieldsDiv.classList.remove('hidden');
    inputFieldsDiv.classList.add('hidden');
    selectFieldsDiv.classList.add('hidden');
};

cancelInputButton.onclick = () => {
    inputFieldsDiv.classList.add('hidden');
};

cancelSelectButton.onclick = () => {
    selectFieldsDiv.classList.add('hidden');
};

cancelTextareaButton.onclick = () => {
    textareaFieldsDiv.classList.add('hidden');
};

addInputElementButton.onclick = () => {
    const label = document.getElementById('input-label').value;
    const placeholder = document.getElementById('input-placeholder').value;
    addElement('input', label, placeholder);
    document.getElementById('input-label').value = '';
    document.getElementById('input-placeholder').value = '';
    inputFieldsDiv.classList.add('hidden');
};

addSelectElementButton.onclick = () => {
    const label = document.getElementById('select-label').value;
    const options = document.getElementById('select-options').value.split(',');
    addElement('select', label, null, options);
    document.getElementById('select-label').value = '';
    document.getElementById('select-options').value = '';
    selectFieldsDiv.classList.add('hidden');
};

addTextareaElementButton.onclick = () => {
    const label = document.getElementById('textarea-label').value;
    const placeholder = document.getElementById('textarea-placeholder').value;
    addElement('textarea', label, placeholder);
    document.getElementById('textarea-label').value = '';
    document.getElementById('textarea-placeholder').value = '';
    textareaFieldsDiv.classList.add('hidden');
};

saveButton.onclick = () => {
    const filteredFormElements = formElements.map(element => {
        const filteredElement = {
            id: element.id,
            type: element.type,
            label: element.label,
            ...(element.type !== 'select' && { placeholder: element.placeholder }),
            ...(element.type !== 'input' && element.type !== 'textarea' && { options: element.options }),
        };
        return filteredElement;
    });
    console.log(JSON.stringify(filteredFormElements, null, 2));
    showToast('Form saved successfully! Please check the console.');
};

function loadSampleData() {
    formElements = sampleData;
    renderForm();
}

loadSampleData();