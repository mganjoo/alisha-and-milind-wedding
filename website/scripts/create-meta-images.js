const sharp = require(`sharp`)
const glob = require(`glob`)

const matches = glob.sync(`src/images/*-hero.jpg`)
const MAX_WIDTH = 960
const QUALITY = 70

Promise.all(
  matches.map(async match => {
    const stream = sharp(match)
    const info = await stream.metadata()

    if (info.width < MAX_WIDTH) {
      return
    }

    const optimizedName = match.replace(
      /src\/images\//,
      (_match, ext) => `static/meta-`
    )

    await stream
      .resize(MAX_WIDTH)
      .jpeg({ quality: QUALITY })
      .toFile(optimizedName)

    console.log(`Wrote optimized hero image: ${optimizedName}`)
  })
)
