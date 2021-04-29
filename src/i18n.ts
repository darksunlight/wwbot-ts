import { Message } from "discord.js";

function i18n(key: string, message: Message, ...args: any[]) {
    return getValue(key, "en", args);
}

function getValue(key: string, lang: string, args: any[]) {
    if (lang === "qqx") {
        console.log(args);
        if (args.length == 0) {
            return `(${key})`;
        } else {
            let qqx = `(${key}: `;
            for(let i = 0; i < args.length; i++){
                qqx += args[i];
                if(i != args.length - 1){
                    qqx += ", ";
                }
            }
            qqx += ")";
            return qqx;
        }
    }
    let langfile = require(`./i18n/${lang}.json`);
    if (typeof langfile[key] === "undefined") {
        langfile = require("./i18n/en.json");
        if (typeof langfile[key] === "undefined") {
            return key;
        }
    }

    let value: string = langfile[key];
    if (args.length > 0) {
        for (let i = 0; i < args.length; i++){
            value = value.replace(new RegExp(`\\$${i+1}`,"g"), args[i]);
        }
    }

    if (value.includes("{{PLURAL:")){
        let found: any = [...value.matchAll(/{{PLURAL:(\d+)\.?\d?\|(.*)}}/g)][0];
        found[2] = found[2].split("|");
        if(found[2].length === 1){
            return value = value.replace(/{{PLURAL:\d+\.?\d?\|.*}}/, found[2][0]);
        }
        if(found[1] === "1"){
            return value = value.replace(/{{PLURAL:\d+\.?\d?\|.*}}/, found[2][0]);
        } else{
            return value = value.replace(/{{PLURAL:\d+\.?\d?\|.*}}/, found[2][1]);
        }
    }
    return value;
}

export { i18n };