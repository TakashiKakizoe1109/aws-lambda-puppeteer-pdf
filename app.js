const getPuppeteer = async () => {
    const puppeteer = require('puppeteer');
    return await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '-–disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
        ]
    });
};

exports.handler = async (event, context) => {

    const url = 'queryStringParameters' in event && 'url' in event.queryStringParameters ? event.queryStringParameters.url : 'https://www.yahoo.co.jp/';
    const width = 'queryStringParameters' in event && 'width' in event.queryStringParameters ? event.queryStringParameters.width : 1680;
    const height = 'queryStringParameters' in event && 'height' in event.queryStringParameters ? event.queryStringParameters.height : 1050;

    const browser = await getPuppeteer();
    const page = await browser.newPage();
    await page.setViewport({
        width: width,
        height: height,
    });
    await page.goto(url, {
        waitUntil: 'networkidle0',
    });

    const result = await page.title();
    const pdf = await page.pdf({
        // path: 'output/output.pdf', // PDFファイルの出力パス(ローカルテスト用)
        scale: 1,                     // 拡大縮小率 1=100%
        displayHeaderFooter: false,   // header,footer 表示
        printBackground: true,        // background印刷
        landscape: false,             // 横向き印刷
        // pageRanges:1,              // 印刷範囲
        // format: 'A4',              // 用紙フォーマット(Letter, Legal, Tabloid, Ledger, A0~A5)
        width: width + 'px',          // 用紙の幅(px,in,cm,mm)
        height: height + 'px',        // 用紙の高さ(px,in,cm,mm)
        // margin: {top: '10mm', right: '10mm', bottom: '10mm', left: '10mm'},
    });
    await browser.close();

    const base64 = pdf.toString("base64");
    return {
        statusCode: 200,
        headers: {
            'Content-Length': Buffer.byteLength(base64),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=output.pdf'
        },
        isBase64Encoded: true,
        body: base64
    };
};