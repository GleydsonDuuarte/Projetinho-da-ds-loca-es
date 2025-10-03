// netlify/functions/get-motos.js - VERSÃO SIMPLIFICADA
exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    // ID da sua planilha
    const SHEET_ID = '1B7mt7DR2xl3NEGzv8ycpdFGDY7txl2jP-ROkG85lhH4';
    
    // URL da API pública do Google Sheets
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    
    console.log('📊 Buscando dados da planilha...');
    
    const response = await fetch(url);
    const text = await response.text();
    
    // Remove o prefixo que o Google Sheets adiciona
    const json = JSON.parse(text.substring(47).slice(0, -2));
    
    const rows = json.table.rows;
    
    if (!rows || rows.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }
    
    // Converter dados da planilha
    const motos = rows.map((row, index) => {
      const cells = row.c || [];
      
      return {
        id: index + 1,
        name: cells[0]?.v || `Moto ${index + 1}`,
        price: cells[1]?.v || 'Consulte',
        year: cells[2]?.v || '2024',
        km: cells[3]?.v || '0-5.000 km',
        image: cells[4]?.v || 'https://images.unsplash.com/photo-1558618666-fcd25856cd63?w=400',
        location: cells[7]?.v || 'Fortaleza - CE',
        category: cells[6]?.v || 'street',
        features: (cells[5]?.v || '').split(',').filter(f => f.trim()),
        gallery: (cells[8]?.v || cells[4]?.v || '').split(',').filter(g => g.trim())
      };
    }).filter(moto => moto.name && moto.name !== 'nome');

    console.log(`✅ ${motos.length} motos carregadas`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(motos)
    };
    
  } catch (error) {
    console.error('❌ Erro:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro ao carregar dados',
        message: error.message
      })
    };
  }
};