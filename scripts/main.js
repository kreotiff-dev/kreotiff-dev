$(document).ready(function() {
    AOS.init();
  
    let currentLanguage = 'en'; // Установка языка по умолчанию

    function loadProfileData(language) {
        const filePath = language === 'ru' ? 'ru.json' : 'en.json';

        $.getJSON(filePath, function(profileData) {
            // Заполнение личных данных
            $('#profile-name').text(profileData.name);
            $('#profile-position').text(profileData.position || 'Position');
            $('#name').text(profileData.name);
            $('#age').text(profileData.age);
            $('#email').text(profileData.email);
            $('#phone').text(profileData.phone);
            $('#location').text(profileData.location);
            $('#footer-name').text(profileData.name);

            // Обновление элементов с атрибутами data-en и data-ru
            updateStaticContent(language);

            // Очистка существующих данных
            $('#nav-menu').empty();
            $('#social-buttons-container').empty();
            $('.experience-content').empty();
            $('.education-content').empty();
            $('.carousel-indicators').empty();
            $('.carousel-inner').empty();
            $('#skill .card-body').empty();

            // Обновление пунктов меню
            const menuItems = [
                { id: 'about', label: profileData.menuItems.aboutTitle, condition: profileData.about },
                { id: 'skill', label: profileData.menuItems.skillsTitle, condition: profileData.skills },
                { id: 'portfolio', label: profileData.menuItems.portfolioTitle, condition: profileData.portfolio },
                { id: 'experience', label: profileData.menuItems.experienceTitle, condition: profileData.experience },
                { id: 'education', label: profileData.menuItems.educationTitle, condition: profileData.education },
                { id: 'reference', label: profileData.menuItems.referencesTitle, condition: profileData.references },
                { id: 'contact', label: profileData.menuItems.contactTitle, condition: profileData.email || profileData.phone }
            ];

            const navMenu = $('#nav-menu');
            menuItems.forEach(item => {
                if (item.condition && item.condition.length) {
                    navMenu.append(`
                        <li class="nav-item"><a class="nav-link smooth-scroll" href="#${item.id}">${item.label}</a></li>
                    `);
                }
            });

            // Социальные сети
            const socialLinks = {
                facebook: { icon: 'fa-facebook', url: profileData.socialLinks.facebook },
                twitter: { icon: 'fa-twitter', url: profileData.socialLinks.twitter },
                telegram: { icon: 'fa-telegram', url: profileData.socialLinks.telegram },
                linkedin: { icon: 'fa-linkedin', url: profileData.socialLinks.linkedin },
                instagram: { icon: 'fa-instagram', url: profileData.socialLinks.instagram }
            };

            const socialButtonsContainer = $('#social-buttons-container');
            Object.values(socialLinks).forEach(link => {
                if (link.url) {
                    socialButtonsContainer.append(`
                        <a class="btn btn-default btn-round btn-lg btn-icon" href="${link.url}" target="_blank" rel="tooltip">
                            <i class="fa ${link.icon}"></i>
                        </a>
                    `);
                }
            });

            // Описание
            $('#about-text').text(profileData.about);

            // Навыки
            if (profileData.skills && profileData.skills.length > 0) {
                const skillContainer = $('#skill .card-body');
                profileData.skills.forEach((skill, index) => {
                    if (index % 3 === 0) {
                        skillContainer.append('<div class="row skill-row"></div>');
                    }
                    $('.skill-row').last().append(`
                        <div class="col-md-4">
                            <div class="progress-container progress-primary"><span class="progress-badge">${skill.name}</span>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-primary" data-aos="progress-full" data-aos-offset="10" data-aos-duration="2000" role="progressbar" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100" style="width: ${skill.level}%;"></div>
                                    <span class="progress-value">${skill.level}%</span>
                                </div>
                            </div>
                        </div>
                    `);
                });
            }

            // Опыт работы
            profileData.experience.forEach(exp => {
                let descriptionList = exp.description.map(item => `<li>${item}</li>`).join('');
                let projectsHTML = exp.projects ? `<p><strong>Projects:</strong> ${exp.projects}</p>` : '';
                let techStackHTML = exp.techStack ? `<p><strong>Tech Stack:</strong> ${exp.techStack}</p>` : '';

                $('.experience-content').append(`
                    <div class="card">
                        <div class="row">
                            <div class="col-md-3 bg-primary" data-aos="fade-right" data-aos-offset="50" data-aos-duration="500">
                                <div class="card-body cc-experience-header">
                                    <p>${exp.date}</p>
                                    <div class="h5">${exp.company}</div>
                                </div>
                            </div>
                            <div class="col-md-9" data-aos="fade-left" data-aos-offset="50" data-aos-duration="500">
                                <div class="card-body">
                                    <div class="h5">${exp.position}</div>
                                    ${projectsHTML}
                                    <ul>${descriptionList}</ul>
                                    ${techStackHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });

            // Образование
            profileData.education.forEach(edu => {
                $('.education-content').append(`
                    <div class="card">
                        <div class="row">
                            <div class="col-md-3 bg-primary" data-aos="fade-right" data-aos-offset="50" data-aos-duration="500">
                                <div class="card-body cc-education-header">
                                    <p>${edu.date}</p>
                                    <div class="h5">${edu.degree}</div>
                                </div>
                            </div>
                            <div class="col-md-9" data-aos="fade-left" data-aos-offset="50" data-aos-duration="500">
                                <div class="card-body">
                                    <div class="h5">${edu.field}</div>
                                    <p>${edu.institution}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });

            // Рекомендации
            profileData.references.forEach((ref, index) => {
                let activeClass = index === 0 ? 'active' : '';
                $('.carousel-indicators').append(`
                    <li data-target="#cc-Indicators" data-slide-to="${index}" class="${activeClass}"></li>
                `);
                $('.carousel-inner').append(`
                    <div class="carousel-item ${activeClass}">
                        <div class="row">
                            <div class="col-lg-2 col-md-3 cc-reference-header">
                                <img src="${ref.image}" alt="Image"/>
                                <div class="h5 pt-2">${ref.name}</div>
                                <p class="category">${ref.position}</p>
                            </div>
                            <div class="col-lg-10 col-md-9">
                                <p>${ref.text}</p>
                            </div>
                        </div>
                    </div>
                `);
            });

            // Контакты
            $('#contact-email').text(profileData.email);
            $('#contact-phone').text(profileData.phone);
            $('#contact-location').text(profileData.location);

            // Социальные сети
            const socialLinksContainer = $('.container.text-center');
            socialLinksContainer.empty(); 

            Object.values(socialLinks).forEach(link => {
                if (link.url) {
                    socialLinksContainer.append(`
                    <a id="${link.id}" class="btn btn-link" href="${link.url}" target="_blank">
                        <i class="fa ${link.icon} fa-2x" aria-hidden="true"></i>
                    </a>
                    `);
                }
            });
        });
    }

    function updateStaticContent(lang) {
        $('[data-en]').each(function() {
            const text = $(this).data(lang);
            $(this).text(text);
        });
    }

    $('.btn-language').click(function() {
        currentLanguage = $(this).data('language');
        loadProfileData(currentLanguage);
    });

    // Загрузка данных по умолчанию
    loadProfileData(currentLanguage);
});
