// js/data.js - APENAS GOOGLE SHEETS, SEM DADOS LOCAIS
async function loadMotosData() {
    try {
        console.log('🔄 Buscando dados do Google Sheets...');
        
        const response = await fetch('/.netlify/functions/get-motos');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar se é um array válido
        if (Array.isArray(data) && data.length > 0) {
            console.log('✅ Dados carregados do Google Sheets:', data.length, 'motos');
            return data;
        } else {
            // Se não tem dados, retorna array vazio
            console.log('📭 Planilha vazia ou sem dados');
            return [];
        }
        
    } catch (error) {
        console.log('❌ Erro ao carregar do Sheets:', error.message);
        return []; // Retorna array vazio em caso de erro
    }
}

// Informações da empresa
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