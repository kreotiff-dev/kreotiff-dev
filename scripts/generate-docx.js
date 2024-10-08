// generate-docx.js

$('#download-cv').click(async function() {
    const lang = currentLanguage;
    const filePath = lang === 'ru' ? 'data/ru.json' : 'data/en.json';
    
    // Загружаем данные профиля из json
    const profileData = await fetch(filePath).then(response => response.json());
    const doc = new docx.Document({
        sections: [
            {
                // Поля документа
                properties: {
                    page: {
                        margin: {
                            top: 500,    
                            bottom: 500,
                            left: 1000,
                            right: 1000,
                        }
                    }
                },
                children: [
                    // Заголовок
                    new docx.Paragraph({
                        text: profileData.name,
                        heading: docx.HeadingLevel.TITLE,
                        alignment: docx.AlignmentType.CENTER,
                        spacing: { before: 100 },
                    }),
                    new docx.Paragraph({
                        text: profileData.position,
                        heading: docx.HeadingLevel.HEADING_2,
                        alignment: docx.AlignmentType.CENTER,
                    }),

                    // Контактная информация
                    new docx.Paragraph({
                        children: [
                            new docx.ExternalHyperlink({
                                children: [
                                    new docx.TextRun({
                                        text: profileData.email,
                                        style: "Hyperlink"
                                    })
                                ],
                                link: `mailto:${profileData.email}`
                            }),
                            new docx.TextRun({
                                text: " • "
                            }),

                            new docx.TextRun({
                                text: profileData.phone
                            }),

                            new docx.TextRun({
                                text: " • "
                            }),

                            new docx.ExternalHyperlink({
                                children: [
                                    new docx.TextRun({
                                        text: "Telegram",
                                        style: "Hyperlink"
                                    })
                                ],
                                link: profileData.socialLinks.telegram
                            })
                        ],
                        alignment: docx.AlignmentType.CENTER 
                    }),

                    // Отступ после блока контактов
                    new docx.Paragraph({ children: [new docx.TextRun("")], spacing: { after: 100 } }),

                    // Раздел "Summary"
                    new docx.Paragraph({
                        text: profileData.sections.about,
                        heading: docx.HeadingLevel.HEADING_2,
                        thematicBreak: true,
                    }),
                    new docx.Paragraph({
                        text: profileData.about,
                    }),

                    // Отступ между секциями
                    new docx.Paragraph({ children: [new docx.TextRun("")], spacing: { after: 200 } }),

                    // Раздел "Experience"
                    new docx.Paragraph({
                        text: profileData.sections.experience,
                        heading: docx.HeadingLevel.HEADING_2,
                        thematicBreak: true,
                    }),
                    ...profileData.experience.map(exp => [
                        new docx.Paragraph({
                            text: exp.position,
                            heading: docx.HeadingLevel.HEADING_3,
                        }),
                        new docx.Table({
                            rows: [
                                new docx.TableRow({
                                    children: [
                                        new docx.TableCell({
                                            children: [
                                                new docx.Paragraph({
                                                    children: [
                                                        new docx.TextRun({
                                                            text: exp.company,
                                                            bold: true, 
                                                        }),
                                                    ],
                                                })
                                            ],
                                            width: { size: 70, type: docx.WidthType.PERCENTAGE },
                                            borders: {
                                                top: { size: 0, color: "FFFFFF" },
                                                bottom: { size: 0, color: "FFFFFF" },
                                                left: { size: 0, color: "FFFFFF" },
                                                right: { size: 0, color: "FFFFFF" }
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [
                                                new docx.Paragraph({
                                                    children: [
                                                        new docx.TextRun({
                                                            text: exp.date,
                                                            bold: true, 
                                                        }),
                                                    ],
                                                    alignment: docx.AlignmentType.RIGHT,
                                                })
                                            ],
                                            width: { size: 30, type: docx.WidthType.PERCENTAGE },
                                            borders: {
                                                top: { size: 0, color: "FFFFFF" },
                                                bottom: { size: 0, color: "FFFFFF" },
                                                left: { size: 0, color: "FFFFFF" },
                                                right: { size: 0, color: "FFFFFF" }
                                            }
                                        }),
                                    ]
                                }),
                            ],
                        }),
                        // Проекты
                        new docx.Paragraph({
                            children: [
                                new docx.TextRun({
                                    text: exp.projects ? `Проекты: ` : "",
                                    bold: true 
                                }),
                                new docx.TextRun({
                                    text: exp.projects || ""
                                })
                            ],
                            indent: { left: 200 },
                        }),
                        // Описание обязанностей 
                        ...exp.description.map(desc => new docx.Paragraph({
                            text: `• ${desc}`,
                            indent: { left: 200, hanging: 120 },
                        })),
                        // Технологический стек
                        new docx.Paragraph({
                            children: [
                                new docx.TextRun({
                                    text: exp.techStack ? `Tech Stack: ` : "",
                                    bold: true
                                }),
                                new docx.TextRun({
                                    text: exp.techStack || ""
                                })
                            ],
                            indent: { left: 200 },
                        }),

                        new docx.Paragraph({
                            children: [
                                new docx.TextRun(""),
                            ],
                            spacing: { after: 50 },
                        }),
                    ]).flat(),

                    // Раздел "Education"
                    new docx.Paragraph({
                        text: profileData.sections.education,
                        heading: docx.HeadingLevel.HEADING_2,
                        thematicBreak: true,
                    }),
                    ...profileData.education.map(edu => [
                        new docx.Paragraph({
                            text: edu.degree,
                            heading: docx.HeadingLevel.HEADING_3,
                        }),
                        new docx.Table({
                            rows: [
                                new docx.TableRow({
                                    children: [
                                        new docx.TableCell({
                                            children: [
                                                new docx.Paragraph({
                                                    children: [
                                                        new docx.TextRun({
                                                            text: edu.institution,
                                                            bold: true, 
                                                        }),
                                                    ],
                                                })
                                            ],
                                            width: { size: 70, type: docx.WidthType.PERCENTAGE },
                                            borders: {
                                                top: { size: 0, color: "FFFFFF" },
                                                bottom: { size: 0, color: "FFFFFF" },
                                                left: { size: 0, color: "FFFFFF" },
                                                right: { size: 0, color: "FFFFFF" }
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [
                                                new docx.Paragraph({
                                                    children: [
                                                        new docx.TextRun({
                                                            text: edu.date,
                                                            bold: true,
                                                        }),
                                                    ],
                                                    alignment: docx.AlignmentType.RIGHT,
                                                })
                                            ],
                                            width: { size: 30, type: docx.WidthType.PERCENTAGE },
                                            borders: {
                                                top: { size: 0, color: "FFFFFF" },
                                                bottom: { size: 0, color: "FFFFFF" },
                                                left: { size: 0, color: "FFFFFF" },
                                                right: { size: 0, color: "FFFFFF" }
                                            }
                                        }),
                                    ]
                                }),
                            ],
                        }),
                        
                        new docx.Paragraph({ children: [new docx.TextRun("")], spacing: { after: 50 } }),
                    ]).flat(),

                    // Раздел "Skills"
                    new docx.Paragraph({
                        text: profileData.sections.skills,
                        heading: docx.HeadingLevel.HEADING_2,
                        thematicBreak: true,
                    }),
                    new docx.Paragraph({
                        text: profileData.skills.map(skill => skill.name).join(', '),
                        spacing: { after: 200 }
                    }),

                    // Социальные ссылки
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun(profileData.sections.contact),
                            new docx.TextRun(": "),
                            new docx.ExternalHyperlink({
                                children: [
                                    new docx.TextRun({
                                        text: "Telegram",
                                        style: "Hyperlink"
                                    })
                                ],
                                link: profileData.socialLinks.telegram 
                            }),
                            new docx.TextRun(", "), 
                            new docx.ExternalHyperlink({
                                children: [
                                    new docx.TextRun({
                                        text: "LinkedIn",
                                        style: "Hyperlink"
                                    })
                                ],
                                link: profileData.socialLinks.linkedin 
                            }),
                        ],
                        spacing: { after: 200 },
                    }),
                ]
            }
        ]
    });

    // Генерация и сохранение документа
    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, "resume.docx");
        console.log("Документ создан и сохранён как resume.docx");
    });
});
