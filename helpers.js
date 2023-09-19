registerSchema = {
    email: {
        isEmail: true,
        errorMessage: 'Укажите корректный email (example@example.com)',
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password должен быть минимум 6 cимволов',
        },
    },
};

idSchema = {
    id: {
        isLength: {
            options: { min: 24, max: 24 },
            errorMessage:
                'Укажите корректный id (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)',
        },
    },
};

titleSchema = {
    title: {
        notEmpty: true,
        errorMessage: 'Title должно быть строкой',
    },
};

module.exports = { registerSchema, idSchema, titleSchema };
