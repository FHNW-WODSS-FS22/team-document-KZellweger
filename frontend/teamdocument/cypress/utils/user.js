import randomUUID from "../../src/utils/uuid";
import {addParagraphByAPI, lockParagraphByAPI, removeParagraphByAPI, updateParagraphContentByAPI} from "./requestUtil";
import country_list from "./countries";

class User {
    constructor() {
        let random = randomUUID();
        this.id = random;
        this.name = random;
        this.image = null;
        this.paragraphs = [];
    }

    selfToJson() {
        return {
            id: this.id,
            name: this.name,
            image: this.image
        }
    }

    rename(name) {
        this.name = name;
    }

    add(paragraph) {
        this.paragraphs.push(paragraph);
    }

    addParagraph() {
        this.add(addParagraphByAPI(this.selfToJson()));
        console.log("Added new paragraph")
    }

    selectRandomWord() {
        const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return pickOne(country_list);
    }

    buildRandomSentence() {
        let newContent = "";
        const upper = Math.floor(Math.random() * 10 + 1)
        for(let i = 0; i < upper; i++) {
            if(newContent !== "") {
                newContent += " "
            }
            newContent += this.selectRandomWord();
        }
        return newContent;
    }

    update(paragraph) {
        for(let i = 0; i < this.paragraphs.length - 1; i++) {
            if (this.paragraphs[i].id === paragraph.id) this.paragraphs[i] = paragraph;
            console.log("Updated paragraph: ", paragraph)
        }
    }

    updateParagraphContent(paragraph) {
        let newContent = this.buildRandomSentence();
        let updated = updateParagraphContentByAPI(this.selfToJson(), paragraph, newContent);
        this.update(updated);
    }

    updateLock(paragraph, lock = true) {
        if(lock) {
            paragraph.lockedBy = this.selfToJson();
        } else {
            paragraph.lockedBy = null;
        }
        let updated = lockParagraphByAPI(this.selfToJson(), paragraph);
        this.update(updated);
    }

    remove(paragraph) {
        for(let i = 0; i < this.paragraphs.length - 1; i++) {
            if (this.paragraphs[i].id === paragraph.id) this.paragraphs.splice(i, 1);
            console.log("Removed paragraph")
        }
    }

    removeParagraph() {
        let toRemove = this.selectRandomParagraph();
        removeParagraphByAPI(this.selfToJson(), toRemove);
        this.remove(toRemove);
    }

    selectRandomParagraph() {
        return this.paragraphs[Math.floor(Math.random() * this.paragraphs.length)];
    }

    randomizeUserBehaviour() {

    }
}

export default User;