const sharp = require(`sharp`)
const glob = require(`glob`)
const fs = require(`fs`)

const matches = glob.sync(`src/images/*-hero.jpg`)
const MAX_WIDTH = 960
const QUALITY = 70

Promise.all(
  matches.map(async match => {
    const stream = sharp(match)
    const info = await stream.metadata()

    const optimizedName = match.replace(
      /src\/images\//,
      (_match, ext) => `static/meta-`
    )

    if (info.width < MAX_WIDTH) {
      fs.copyFileSync(match, optimizedName)
    } else {
      await stream
        .resize(MAX_WIDTH)
        .jpeg({ quality: QUALITY })
        .toFile(optimizedName)
    }

    console.log(`Wrote optimized hero image: ${optimizedName}`)
  })
)
