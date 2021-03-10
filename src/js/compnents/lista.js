export default class Lista {
    constructor() {
        
        let listaDeItens = localStorage.getItem('listItens');
        if (!listaDeItens) {
            fetch('https://private-21e8de-rafaellucio.apiary-mock.com/users')
                .then(resp => resp.json())
                .then(resp => listaDeItens = resp)
                .then(resp => localStorage.setItem('listItens', JSON.stringify(resp)))
                .then( () => this.init() );
        } else {
            this.init();
        }
        

    }
    init() {
        if (window.location.pathname !== '/formPage.html') {
            this.showLista();
        } else {
            if (window.localStorage.editItem) {
                this.setEdition();
            }
            this.inputBehavior();
            this.inputMasks();
            this.registerPerson();
        }
    }
    onlyNumbers ($input) {
        let test = $input.value.split('');
        if (test.length && !test[test.length - 1].match(/[0-9]/g)) {
            test.pop();
        }
        $input.value = test.toString().replace(/\,|\.|\(|\)|\-|\s/g,'');
        return $input.value;
    }
    simpleMask(value, type) {
        const $valSplit = value.split('');
        if (type === 'cpf') {
            $valSplit.splice(9,0,'-');
            $valSplit.splice(6,0,'.');
            $valSplit.splice(3,0,'.');
            return $valSplit.toString().replace(/\,/g, '');
        } 
        if (type === 'phone') {
            if ($valSplit.length === 11) {
                $valSplit.splice(7,0,'-');
            } else {
                $valSplit.splice(6,0,'-');
            }
            $valSplit.splice(2,0,' ');
            $valSplit.splice(2,0,')');
            $valSplit.splice(0,0,'(');
            return $valSplit.toString().replace(/\,/g, '');
        }
    }
    inputMasks() {
        document.querySelectorAll('.form__input').forEach( $input => {
            
            $input.oninput = e => {
                if ($input.name === 'cpf') {
                    let $val = this.onlyNumbers($input);
                    const $valSplit = $input.value.split('');
                    if ($val.length >= 10) {
                        $valSplit.splice(9,0,'-');
                        $valSplit.splice(6,0,'.');
                        $valSplit.splice(3,0,'.');
                        $input.value = $valSplit.toString().replace(/\,/g, '');
                    } else if ($val.length >= 7) {
                        $valSplit.splice(6,0,'.');
                        $valSplit.splice(3,0,'.');
                        $input.value = $valSplit.toString().replace(/\,/g, '');
                    } else if ($val.length >= 4) {
                        $valSplit.splice(3,0,'.');
                        $input.value = $valSplit.toString().replace(/\,/g, '');
                    }        
                }

                if ($input.name === 'phone') {
                    let $val = this.onlyNumbers($input);
                    const $valSplit = $input.value.split('');

                    if ($val.length === 11) {
                        $valSplit.splice(7,0,'-');
                        $valSplit.splice(2,0,' ');
                        $valSplit.splice(2,0,')');
                        $valSplit.splice(0,0,'(');
                        $input.value = $valSplit.toString().replace(/\,/g, '');
                    } else if ($val.length >= 7) {
                        $valSplit.splice(6,0,'-');
                        $valSplit.splice(2,0,' ');
                        $valSplit.splice(2,0,')');
                        $valSplit.splice(0,0,'(');
                        $input.value = $valSplit.toString().replace(/\,/g, '');
                    } else if ($val.length >= 3) {
                        $valSplit.splice(2,0,' ');
                        $valSplit.splice(2,0,')');
                        $valSplit.splice(0,0,'(');
                        $input.value = $valSplit.toString().replace(/\,/g, '');
                    }   
                }
            };

        });
    }
    registerPerson() {
        const addWarning = (target, string) => {
            const $small = document.createElement("small");
            $small.classList.add('warning');
            $small.innerText = string;
            target.after($small);
            target.classList.add('warning');
            return;
        }

        const removeWarnings = () => {
            document.querySelectorAll('small.warning').forEach( warn => {
                warn.parentNode.removeChild(warn);
            });
            document.querySelectorAll('input.warning').forEach( warn => {
                warn.classList.remove('warning');
            });
        }

        const verifyIfEmpty = (inputs) => {
            for (let i = 0; i < inputs.length; i++) {
                const $input = inputs[i];

                if (!$input.value) {
                    $input.classList.add('warning');
                    addWarning($input, 'Este item é obrigatório');
                }
            }
        }

        const btnCadastrar = document.querySelector('.btn--cadastrar');

        btnCadastrar.addEventListener('click', (e) => {
            
            const inputs = document.querySelectorAll('.form__input');

            const person = {};

            removeWarnings();            

            verifyIfEmpty(inputs);

            inputs.forEach(input => {
                const $val = input.value;

                if (input.name === 'name') {
                    if(input.value && input.value.length < 3) {
                        addWarning(input, 'Campo deve conter 3 caractéres ou mais');
                        return;
                    } else {
                        person.name = input.value;
                    }
                }

                if (input.name === 'email') {
                    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

                    if(input.value && !input.value.match(mailformat)) {
                        addWarning(input, 'Digite um e-mail válido');
                        return;
                    } else {
                        person.email = input.value;
                    }
                }

                if (input.name === 'cpf') {
                    const $input = this.onlyNumbers(input);
                    if($input && $input.length < 11) {
                        addWarning(input, 'Número inválido ou incompleto');
                        input.value = $val;
                        return;
                    } else {
                        person.cpf = $input;
                    }
                }

                if (input.name === 'phone') {
                    const $input = this.onlyNumbers(input)
                    if($input && $input.length < 10) {
                        addWarning(input, 'Número inválido ou incompleto');
                        input.value = $val;
                        return;
                    } else {
                        person.phone = $input;
                    }
                }

                input.value = $val;
            });

            if (!document.querySelectorAll('.warning').length) {
                const $editItem = window.localStorage.editItem && JSON.parse(window.localStorage.editItem);
                
                const $arr = JSON.parse(window.localStorage.listItens);
                
                if ($editItem) {
                    $arr[$editItem.index] = person;
                } else {
                    $arr.push(person);
                }

                window.localStorage.listItens = JSON.stringify($arr);

                window.localStorage.editItem = '';

                btnCadastrar.classList.add('hide');

                setTimeout(() => {
                    
                    window.location.href = '/';    
                }, 1500);
                
            }

        });
    }
    inputBehavior() {
        var inputs = document.querySelectorAll('.form__input');

        for (let i = 0; i < inputs.length; i++) {
            const $input = inputs[i];
            const formGroup = $input.closest('.form__group');

            if ($input.value) {
                formGroup.classList.add('focus');
            } 

            $input.onfocus = e => formGroup.classList.add('focus');

            $input.onblur = e => {
                if (!$input.value) {
                    formGroup.classList.remove('focus');
                }
            }

            
        }
    }
    setEdition(){
        const itemToEdit = JSON.parse(window.localStorage.editItem);

        const select = (el) => document.querySelector(el);

        select('.section').classList.add("section--edit");

        const $inputs = {};
        $inputs.name = select('#name');
        $inputs.email = select('#email');
        $inputs.cpf = select('#cpf');
        $inputs.phone = select('#phone');

        $inputs.name.value = itemToEdit.obj.name;
        $inputs.email.value = itemToEdit.obj.email;
        $inputs.cpf.value = this.simpleMask(itemToEdit.obj.cpf, 'cpf');
        $inputs.phone.value = this.simpleMask(itemToEdit.obj.phone, 'phone');

        document.querySelector('.btn--cadastrar').innerText = 'Salvar';
    }
    editItem() {
        const $itens = document.querySelectorAll('.list__item');

        const selectItem = i => {
            const arr = JSON.parse(localStorage.getItem('listItens'));
            return JSON.stringify({index: i, obj: arr[i]});
        }

        for (let i = 0; i < $itens.length; i++) {
            const $item = $itens[i];

            $item.querySelector('.list__item__content').addEventListener('click', (e) => {
                const $index = $item.getAttribute('data-index');
                const $strItem = selectItem($index);
                localStorage.setItem('editItem', $strItem);
                window.location.href = '/formPage.html';
            });
        }
    }
    showLista() {
        window.localStorage.editItem = '';

        const lista = JSON.parse(localStorage.getItem('listItens'));
        
        const sectionList = document.querySelector('.list');

        const listaHtml = list => {
            let $txt = '';

            for (let i = 0; i < list.length; i++) {
                const el = list[i];
                $txt += `<li class="list__item" data-index="${i}">
                    <span class="btn--delete">+</span>
                    <div class="list__item__content">
                    <h3 class="list__item__name">${el.name}</h3>
                    <p class="list__item__email">${el.email}</p>
                    <small class="list__item__cpf"><strong>CPF:</strong> ${this.simpleMask(el.cpf, 'cpf')}</small> | 
                    <small class="list__item__telefone"><strong>Tel:</strong> ${this.simpleMask(el.phone, 'phone')}</small>
                    </div>
                </li>`;
            }

            return $txt;
        }

        sectionList.innerHTML = listaHtml(lista);

        this.deleteItem();
        this.editItem();
    }
    deleteItem() {
        const delBtns = document.querySelectorAll('.btn--delete');

        delBtns.forEach($btn => {
            $btn.addEventListener('click', (e) => {
                const $index = $btn.parentNode.getAttribute('data-index');
                
                const $arr = JSON.parse(window.localStorage.listItens);

                $arr.splice($index, 1);

                window.localStorage.listItens = JSON.stringify($arr);

                this.showLista();

            });
        });
    }
}
