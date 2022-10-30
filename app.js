const express = require('express')
const fetch = require('node-fetch')
const app = express()
const port = 3000
const cheerio = require('cheerio')
var search_text = 'Java+Book'
const url = `https://libgen.is/search.php?&req=${search_text}&phrase=1&view=simple&column=def&sort=def&sortmode=ASC&page=2`
app.get('/', (req, res) => {
    async function getData(url) {
        const response = await fetch(url)
        const body = await response.text()
        const $ = cheerio.load(body)
        const rows = []
        //const table_c = $('table.c > tbody > tr')
        $('table.c > tbody > tr').map((idx, el) => {
            if (idx != 0) {
                let serial = $(el).children()
                booknamePtr = serial[2].children.length
                let book = {
                    id: serial[0].children[0].data,  // for serial number
                    bookName: serial[2].children[booknamePtr - 1].children[0].data,
                    pages: (checkChildrenLength(serial[5].children.length) ? 0 : serial[5].children[0].data),
                    language: serial[6].children[0].data,
                    size: serial[7].children[0].data,
                    extension: serial[8].children[0].data,
                    mirror_links: {
                        link1: serial[9].children[0].attribs.href,
                        link2: serial[10].children[0].attribs.href,
                        link3: serial[11].children[0].attribs.href,
                    }
                }
                rows.push(book);
            }
        })
        console.log(rows)
        res.send(rows)
    }
    getData(url)

})



function checkChildrenLength(length) {
    if (length == 0)
        return true;
    else
        return false
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})