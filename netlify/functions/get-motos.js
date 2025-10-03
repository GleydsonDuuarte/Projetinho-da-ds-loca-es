const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const SHEET_ID = '1B7mt7DR2xl3NEGzv8ycpdFGDY7txl2jP-ROkG85lhH4';
    
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.loadInfo();
    
    let sheet;
    if (doc.sheetsByTitle['Motos']) {
      sheet = doc.sheetsByTitle['Motos'];
    } else if (doc.sheetsByTitle['motos']) {
      sheet = doc.sheetsByTitle['motos'];
    } else {
      sheet = doc.sheetsByIndex[0];
    }
    
    const rows = await sheet.getRows();
    
    const motos = rows.map((row, index) => {
      const rawData = row._rawData || [];
      
      return {
        id: index + 1,
        name: rawData[0] || `Moto ${index + 1}`,
        price: rawData[1] || 'Consulte',
        year: rawData[2] || '2024',
        km: rawData[3] || '0-5.000 km',
        image: rawData[4] || 'https://images.unsplash.com/photo-1558618666-fcd25856cd63?w=400',
        location: rawData[7] || 'Fortaleza - CE',
        category: rawData[6] || 'street',
        features: (rawData[5] || '').split(',').filter(f => f.trim()),
        gallery: (rawData[8] || rawData[4] || '').split(',').filter(g => g.trim())
      };
    }).filter(moto => moto.name && moto.name !== 'Moto 1' && moto.name !== 'nome');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(motos)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro ao carregar dados da planilha',
        message: error.message
      })
    };
  }
};