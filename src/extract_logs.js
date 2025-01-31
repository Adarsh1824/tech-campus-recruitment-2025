const fs = require("fs");
const readline = require("readline");
const path = require("path");

async function extractLogs(date, logFile = "test_logs.log") {
    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const outputFile = path.join(outputDir, `output_${date}.txt`);
    const readStream = fs.createReadStream(logFile, { encoding: "utf-8" });
    const writeStream = fs.createWriteStream(outputFile, { encoding: "utf-8" });
    const rl = readline.createInterface({ input: readStream });

    for await (const line of rl) {
        if (line.startsWith(date)) {
            writeStream.write(line + "\n");
        }
    }

    writeStream.end();
    console.log(`Logs for ${date} saved in ${outputFile}`);
}

if (process.argv.length !== 3) {
    console.log("Usage: node extract_logs.js YYYY-MM-DD");
    process.exit(1);
}

const dateArg = process.argv[2];
extractLogs(dateArg);
