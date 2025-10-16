const getStats = (req, res) => {
    const stats = {
        users: 15,
        products: 8,
        orders: 5,
        revenue: 125000
    };
    res.render("dashboard-stats", { stats });
};

const getReport = (req, res) => {
    const report = `
=== ЗВІТ СИСТЕМИ ===
Дата: ${new Date().toLocaleDateString('uk-UA')}
Час: ${new Date().toLocaleTimeString('uk-UA')}

Користувачів: 15
Товарів: 8
Замовлень: 5
Дохід: 125,000 грн

Статус: Всі системи працюють нормально
    `;
    res.send(`<pre>${report}</pre>`);
};

module.exports = {
    getStats,
    getReport
};
