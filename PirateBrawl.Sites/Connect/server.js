const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const database = require('./DatabaseManager'); // Импортируем базу данных
const lowID = require('./lowID'); // Импортируем файл lowID.js

const app = express();
const PORT = 3000;

let verificationCodes = {}; // Хранилище кодов для подтверждения

// Настройка body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройки SMTP для Mail.ru
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'mix.mail@seemblox.ru', // Ваша почта
        pass: '1bPcpDWwc0uzpS3irrxv' // Ваш пароль
    }
});

// Генерация случайного кода
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-значный код
}

// Обработчик маршрута для /register
app.post('/register', (req, res) => {
    const { email } = req.body;
    const verificationCode = generateCode();

    // Сохраняем код для проверки
    verificationCodes[email] = verificationCode;

    // Стилизация письма с изображением в стиле Supercell
    const mailOptions = {
        from: 'mix.mail@seemblox.ru',
        to: email,
        subject: 'Код подтверждения',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Code</title>
                <style>
                    body {
                        background: linear-gradient(to right, red, blue); /* Градиент от красного к синему */
                        color: #fff;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        margin: 0 auto;
                        padding: 20px;
                        max-width: 600px;
                        background-color: rgba(0, 0, 0, 0.8); /* Полупрозрачный фон */
                        border-radius: 8px;
                    }
                    h1 {
                        color: #ffcc00;
                        font-size: 24px;
                    }
                    p {
                        color: #fff;
                        font-size: 18px;
                    }
                    .code-box {
                        margin: 20px 0;
                        padding: 10px 0;
                        font-size: 36px;
                        background-color: #222;
                        border-radius: 5px;
                        border: 1px solid #ffcc00;
                        display: inline-block;
                        color: #ffcc00;
                        font-weight: bold;
                        letter-spacing: 5px;
                    }
                    .footer {
                        font-size: 14px;
                        color: #999;
                    }
                    .header-img {
                        width: 100%;
                        height: auto;
                        margin-bottom: 20px;
                    }
                    .promo {
                        display: flex;
                        align-items: center;
                        margin-top: 20px;
                    }
                    .promo img {
                        width: 150px; /* Увеличенная ширина изображения */
                        height: auto; /* Автоматическая высота для сохранения пропорций */
                        margin-right: 20px; /* Отступ справа */
                    }
                    .promo-text {
                        text-align: left;
                        font-size: 20px; /* Увеличен размер текста */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="https://i.imgur.com/TfUOmH8.jpg" alt="Header Image" class="header-img"> <!-- Изменено на ссылку -->
                    <h1>Welcome back!</h1>
                    <p>Use the verification code below to log in:</p>
                    <div class="code-box">${verificationCode}</div>
                    
                    <!-- Блок с GIF и текстом -->
                    <div class="promo">
                        <img src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoic3VwZXJjZWxsXC9maWxlXC80RzU3Rlo3THNoWjZ6bmdLZ3NROC5naWYifQ:supercell:78mgzWFZviaTdC5Wt8n7zUmMjVa8WdYsndBX78LG4Xg?width=2400" alt="Promo GIF">
                        <div class="promo-text">
                            Играйте в Mix Brawl на обновлении с МАКС и БЕА!<br>
                            Скачать Mix Brawl можно в <a href="https://t.me/mixbrawlclose" style="color: #ffcc00;">Telegram канале</a> или в <a href="https://t.me/mixbrawlclose" style="color: #ffcc00;">RuStore</a>
                        </div>
                    </div>

                    <p class="footer">You received this email because you requested to log in. If you didn't request it, please ignore this message.</p>
                </div>
            </body>
            </html>
        `,
    };

    // Отправка письма
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Ошибка при отправке письма:', error);
            return res.status(500).json({ message: 'Ошибка отправки письма' });
        }
        console.log('Письмо отправлено: %s', info.messageId);
        res.json({ message: 'Код подтверждения отправлен на вашу почту!' });
    });
});

// Обработчик маршрута для /verify-code
app.post('/verify-code', (req, res) => {
    const { code } = req.body;
    const email = Object.keys(verificationCodes).find(email => verificationCodes[email] === code);

    if (email) {
        delete verificationCodes[email]; // Удаляем код после успешной проверки
        return res.json({ message: 'Код успешно подтвержден!' });
    } else {
        return res.status(400).json({ message: 'Неверный код подтверждения' });
    }
});

// Новый API маршрут для получения данных профиля
app.get('/api/profile/:tag', (req, res) => {
    const { tag } = req.params;
    let reversedTag = lowID(tag)
    const account = database.getAccount(reversedTag); // Получаем аккаунт по тегу
    console.log(account)

    if (!account) {
        return res.json({ error: 'Аккаунт не найден' });
    }

    return res.json({
        name: account.Name,
        trophies: account.Trophies,
        gems: account.Resources.Gems,
    });
});

// Маршрут для страницы профиля
app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/main.html'); // Отправляем HTML файл
});


// Настройка для обслуживания статических файлов
app.use(express.static(__dirname));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
