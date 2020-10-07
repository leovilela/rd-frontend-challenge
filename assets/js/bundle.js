(() => {
    const sessionTime = 300000;
    const selector = selector => document.querySelector(selector);
    const create = element => document.createElement(element);
    const remove = element => element.remove();
    const elementContent = content => document.createTextNode(content)
    const app = selector('#app');
    const body = selector('body');
    const Login = create('div');
    Login.classList.add('login');
    const Users = create('div');    
    Users.classList.add('users');
    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');
    const FormLogin = create('div');
    FormLogin.classList.add('formLogin');
    const Form = create('form');
    Form.classList.add('form');

    Form.onsubmit = async e => {
        loading(true);
        e.preventDefault();
        const [data] = e.target.parentElement.children;
        const {url} = await fakeAuthenticate(email.value, password.value);
        location.href='#users';        
        remove(FormLogin);
        app.appendChild(Users);
        Users.appendChild(Logo);
        const users = await getDevelopersList(url);
        renderPageUsers(users);
        loading(false);
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
    let loadingIco = create(`div`);
    loadingIco.classList.add('loading');
    body.appendChild(loadingIco);


    async function fakeAuthenticate(email, password) {
        const response = await fetch(`http://www.mocky.io/v2/5dba690e3000008c00028eb6`);
        const data = await response.json();
        const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+sessionTime}`;
        localStorage.setItem('token', fakeJwtToken);       
        return data;
    }

    async function getDevelopersList(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = 'inline-block';
        const Ul = create('ul');
        Ul.classList.add('container');
        Users.appendChild(Ul);         

        users.map((user => {
            let node = Ul.appendChild(create(`li`));
            node.classList.add('userContainer');
            let image = node.appendChild(create(`div`));
            let upImage = image.appendChild(create(`div`));
            image.setAttribute("style", `background-image:url("${user.avatar_url}")`);
            upImage.setAttribute("style", `background-image:url("${user.avatar_url}")`);
            image.classList.add('avatar');
            upImage.classList.add('upAvatar');
            node.appendChild(image);
            let divText = Ul.appendChild(create(`li`));
            let textNode = elementContent(user.login)
            divText.classList.add('divText');
            divText.appendChild(textNode);
            node.appendChild(divText);
            node.onclick = e => {
                window.location.href = user.html_url
            };            
        }))
    }

    function loading(status) {
        if(status) {
            loadingIco.setAttribute("style", "display:inline-block")
        }
        loadingIco.setAttribute("style", "display:none")
            

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
            loading(true);
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            app.appendChild(Users);
            Users.appendChild(Logo);
            renderPageUsers(users);
            loading(false);
        }
    })()
})()