(() => {
    const selector = selector => document.querySelector(selector);
    const create = element => document.createElement(element);

    const app = selector('#app');

    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const FormLogin = create('div');
    FormLogin.classList.add('formLogin');

    const Form = create('form');
    Form.classList.add('form');

    Form.onsubmit = async e => {
        e.preventDefault();
        const [data] = e.target.parentElement.children;

        const {url} = await fakeAuthenticate(email.value, password.value);

        location.href='#users';
        
        const users = await getDevelopersList(url);
        renderPageUsers(users);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        (!email.validity.valid || !email.value || password.value.length <= 5) 
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };
    
    Form.innerHTML = `
    <input type="email" id="email" class="email" placeholder="Entre com seu e-mail" >
    <input type="password" id="password" class="password" placeholder="Digite sua senha supersecreta">
    <button class="entrar" disabled="disabled">Entrar</button>
    `
    
    Login.appendChild(Logo);
    Login.appendChild(FormLogin);
    FormLogin.appendChild(Form);

    async function fakeAuthenticate(email, password) {


        const response = await fetch(`http://www.mocky.io/v2/5dba690e3000008c00028eb6`);
        const data = await response.json();

        const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
        
        localStorage.setItem('token', fakeJwtToken);

        return data;
    }

    async function getDevelopersList(url) {
        /**
         * bloco de código omitido
         * aqui esperamos que você faça a segunda requisição 
         * para carregar a lista de desenvolvedores
         */
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = 'inline-block'

        const Ul = create('ul');
        Ul.classList.add('container')

        /**
         * bloco de código omitido
         * exiba a lista de desenvolvedores
         */

        app.appendChild(Ul)
    }

    // init
    (async function(){
        const rawToken = localStorage.getItem('token');
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href='#login';
            app.appendChild(Login);
        } else {
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()