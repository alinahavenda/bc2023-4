const fs = require ('fs');
const http = require('http');
const xml = require ('fast-xml-parser');

const host = "localhost";
const port = "8000";

function minValue (data)
{
    let startvalue = Infinity;
    for(const obj of data.indicators.res){
        if (obj.value < startvalue){
            startvalue = obj.value;
        }
    }
    return startvalue;
}

const requestListener = function (req,res){
    const readData = fs.readFileSync('data.xml', 'utf-8');

    const parser = new xml.XMLParser();
    const xmlp = parser.parse(readData);
    const min = minValue(xmlp);
    
    const prres = {
        data: {
            min_value: min,
        },
    };

    const builder = new xml.XMLBuilder();
    const xmlb = builder.build(prres);

    fs.writeFileSync("res.xml", xmlb);
    res.writeHead(200);
    res.end(xmlb);
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log (`Server is running on http://${host}:${port}`);
})