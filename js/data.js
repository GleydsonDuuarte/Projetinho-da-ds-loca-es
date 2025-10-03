const motosDataLocal = [
    {
        id: 1,
        name: "Honda CG 160",
        price: "1.299,00/mês",
        year: "2023/2024",
        km: "0-5.000 km",
        image: "images/motos/honda-cg-1.jpg",
        location: "Fortaleza - CE",
        category: "street",
        features: ["Injeção Eletrônica", "Partida Elétrica", "Baixo Consumo"],
        gallery: ["images/motos/honda-cg-1.jpg", "images/motos/honda-cg-3.jpg"]
    },
    {
        id: 2,
        name: "Yamaha Factor 150",
        price: "1.299,00/mês",
        year: "2023/2024",
        km: "0-5.000 km",
        image: "images/motos/yamaha-factor-1.jpg",
        location: "Fortaleza - CE",
        category: "street",
        features: ["Robusta", "Econômica", "Manutenção Simples"],
        gallery: ["images/motos/yamaha-factor-1.jpg"]
    },
    {
        id: 3,
        name: "Honda Biz 125",
        price: "1.899,00/mês",
        year: "2023/2024",
        km: "0-5.000 km",
        image: "images/motos/honda-biz-1.jpg",
        location: "Fortaleza - CE",
        category: "scooter",
        features: ["Automática", "Econômica", "Baú Incluso"],
        gallery: ["images/motos/honda-biz-1.jpg"]
    }
];

async function loadMotosData() {
    try {
        const response = await fetch('/.netlify/functions/get-motos');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            return data;
        } else {
            return motosDataLocal;
        }
        
    } catch (error) {
        return motosDataLocal;
    }
}

const companyInfo = {
    name: "DS Locações",
    slogan: "Aluguel de motos para aplicativos",
    phones: ["(85) 8949-9750"],
    workingHours: {
        weekdays: "Segunda a Sexta: 8h às 18h",
        saturday: "Sábado: 8h às 12h",
        support: "Suporte emergencial: 24h"
    },
    socialMedia: {
        instagram: "https://www.instagram.com/ds_locacoes85",
        whatsapp: "https://api.whatsapp.com/send?phone=%2B558589499750",
        facebook: "https://www.facebook.com/share/16SEdaRRyr/?mibextid=wwXIfr"
    },
    services: ["Aluguel", "Aplicativos", "Gestão", "Suporte"]
};