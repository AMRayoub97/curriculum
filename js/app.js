const boton = document.getElementById('estilos');
const theme = document.getElementById('estilo');

// Función para cambiar el tema CSS
function action() {
    if (boton.value === "retro") {
        theme.href = './css/moderno.css';
        boton.value = "moderno";
    } else {
        theme.href = './css/retro.css';
        boton.value = "retro";
    }
}

// Función para cambiar el idioma
async function cambiarIdioma(idioma) {
    try {
        const response = await fetch(`./json/${idioma}.json`);
        if (!response.ok) throw new Error(`No se pudo cargar: json/${idioma}.json`);
        
        const data = await response.json();

        // 1. Título y Nombre
        document.getElementById('page-title').innerText = data.titulo || data.title;
        const nombreBase = "AYOUB AMMARI";
        const subtitulo = (idioma === 'es') ? "DESARROLLADOR WEB" : "WEB DEVELOPER";
        document.getElementById('main-name').innerHTML = `${nombreBase} <br> ${subtitulo}`;

        // 2. Perfil
        const perfilData = data.perfil || data.profile;
        document.getElementById('perfil-texto').innerText = perfilData.descripcion || perfilData.description;

        // 3. Traducción de Menú y Botones "Ir arriba"
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            const parts = key.split('.'); 
            let translation = data;

            parts.forEach(part => {
                if (translation) {
                    // Diccionario de equivalencias para que encuentre las llaves en ambos idiomas
                    const mapping = {
                        "perfil": "profile",
                        "ir_arriba": "go_up",
                        "descripcion": "description",
                        "educacion": "education",
                        "idiomas": "languages",
                        "practicas": "internships",
                        "proyectos": "projects",
                        "competencias_tecnicas": "technical_skills",
                        "competencias_personales": "personal_skills",
                        "contacto": "contact"
                    };
                    translation = translation[part] || translation[mapping[part]];
                }
            });

            if (translation) elem.innerText = translation;
        });

        // 4. Educación
        const eduContainer = document.getElementById('container-educacion');
        const listaEdu = data.educacion || data.education;
        eduContainer.innerHTML = listaEdu.map(edu => `
            <article>
                <h2>${edu.titulo || edu.title}</h2>
                <date>${edu.fecha || edu.date}</date><br>
                <small><img src="./img/maria.png" style="width: 20px;"> <strong>${idioma === 'es' ? 'instituto' : 'institute'}:</strong> ${edu.instituto || edu.institute}</small>
            </article><hr>
        `).join('');

        // 5. Idiomas
        const iconosIdiomas = {
            "Español": "spain.webp", "Spanish": "spain.webp",
            "Inglés": "ik.jpg", "English": "ik.jpg",
            "Arabe": "morocco.svg", "Arabic": "morocco.svg",
            "Francés": "fr.jpg", "French": "fr.jpg"
        };
        const idioContainer = document.getElementById('container-idiomas');
        const listaIdio = data.idiomas || data.languages;
        idioContainer.innerHTML = listaIdio.map(i => `
            <article>
                <ul>
                    <li><strong><img src="./img/${iconosIdiomas[i.nombre || i.name] || 'cv.jpg'}" style="width: 20px;"> ${i.nombre || i.name}</strong></li>
                    <ul>
                        <li><strong>${idioma === 'es' ? 'nivel' : 'level'}:</strong> ${i.nivel || i.level}</li>
                        ${(i.certificado || i.certificate) ? `<li><strong>${idioma === 'es' ? 'certificado' : 'certificate'}:</strong> ${i.certificado || i.certificate}</li>` : ''}
                    </ul>
                </ul><hr>
            </article>
        `).join('');

        // 6. Prácticas
        const pr = data.practicas || data.internships;
        const listaTareas = pr.tareas || pr.tasks || [];
        document.getElementById('practicas-empresa').innerText = pr.empresa || pr.company;
        document.getElementById('practicas-fecha').innerText = pr.fecha || pr.date;
        document.getElementById('practicas-link').innerText = pr.pagina || pr.page;
        document.getElementById('practicas-tareas').innerHTML = listaTareas.map(t => `<li>${t}</li>`).join('');

        // 7. Proyectos
        const proContainer = document.getElementById('container-proyectos');
        const listaPro = data.proyectos || data.projects;
        proContainer.innerHTML = listaPro.map(proy => `
            <article>
                <h2>${proy.titulo || proy.title}</h2>
                <p><strong>${idioma === 'es' ? 'Descripción' : 'Description'}:</strong> ${proy.descripcion || proy.description}</p>
                <h3>${idioma === 'es' ? 'Herramientas' : 'Tools'}:</h3>
                <ul>${Array.isArray(proy.herramientas || proy.tools) 
                    ? (proy.herramientas || proy.tools).map(h => `<li>${h}</li>`).join('')
                    : Object.entries(proy.herramientas || proy.tools).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')
                }</ul>
                ${proy.pagina || proy.page ? `<a href="#" target="_blank">${proy.pagina || proy.page}</a>` : ''}
            </article><hr>
        `).join('');

        // 8. Competencias Técnicas (Tabla)
        const ct = data.technical_skills || data.competencias_tecnicas;
        const labelTec = (idioma === 'es') ? ["Lenguajes", "Bases de datos", "Herramientas"] : ["Languages", "Databases", "Tools"];
        document.getElementById('tabla-tecnica').innerHTML = `
            <tr><td><strong>${labelTec[0]}:</strong></td><td>${(ct.languages || ct.lenguajes).join(', ')}</td></tr>
            <tr><td><strong>${labelTec[1]}:</strong></td><td>${(ct.databases || ct.bases_datos).join(', ')}</td></tr>
            <tr><td><strong>Frameworks:</strong></td><td>${ct.frameworks.join(', ')}</td></tr>
            <tr><td><strong>${labelTec[2]}:</strong></td><td>${(ct.tools || ct.herramientas).join(', ')}</td></tr>
        `;

        // 9. Competencias Personales (Meters)
        const pers = data.personal_skills || data.competencias_personales;
        document.getElementById('container-personales').innerHTML = Object.entries(pers).map(([k, v]) => `
            <div>
                <label style="display:inline-block; width:200px;">${k.replace(/_/g, ' ')}</label> 
                <meter value="${v}" min="0" max="10" style="width:200px;"></meter>
            </div>
        `).join('');

        // 10. Contacto
        const cont = data.contacto || data.contact;
        document.getElementById('cont-tel').innerText = cont.telefono || cont.phone;
        document.getElementById('cont-tel').href = `tel:${cont.telefono || cont.phone}`;
        document.getElementById('cont-email').innerText = cont.email;
        document.getElementById('cont-email').href = `mailto:${cont.email}`;
        document.getElementById('cont-github').innerText = cont.github;
        document.getElementById('cont-ciudad').innerText = `${idioma === 'es' ? 'Ciudad' : 'City'}: ${cont.ciudad || cont.city}`;

    } catch (error) {
        console.error("Error cargando idioma:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => cambiarIdioma('es'));