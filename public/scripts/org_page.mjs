const partners = document.querySelector('ul');

organizations.forEach(organization => {
    const list = document.createElement('li');
    const logo = document.createElement('img');
    const name = document.createElement('strong');

    logo.setAttribute('src',`/images/${organization.logo_filename}`)
    logo.setAttribute('alt',`${organization.name} logo`)

    name.value = organization.name;

    list.appendChild(logo);
    list.appendChild(name);

    list.value = `: ${organization.contact_email}`;

    partners.appendChild(list);
     }); 