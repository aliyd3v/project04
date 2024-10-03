exports.sendDataToSheetDB = async data => {
    const url = 'https://sheetdb.io/api/v1/rjr1wi8mdvymi';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "data": data
            })
        });
        const result = await response.json();

        console.log('Data successfully sent:', result);

    } catch (error) {
        console.error('Error sending data:', error.message);
        console.log(error);
    }
};
