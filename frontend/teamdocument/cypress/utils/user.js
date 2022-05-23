import randomUUID from '../../src/utils/uuid';
import {
  addParagraphByAPI, lockParagraphByAPI, removeParagraphByAPI, updateParagraphContentByAPI,
} from './requestUtil';
// eslint-disable-next-line camelcase
import country_list from './countries';

class User {
  constructor() {
    const random = randomUUID();
    this.id = random;
    this.name = random;
    this.image = null;
    this.paragraphs = [];
  }

  selfToJson() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
    };
  }

  rename(name) {
    this.name = name;
  }

  add(paragraph) {
    this.paragraphs.push(paragraph);
  }

  addParagraph() {
    this.add(addParagraphByAPI(this.selfToJson()));
  }

  // eslint-disable-next-line class-methods-use-this
  selectRandomWord() {
    const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return pickOne(country_list);
  }

  buildRandomSentence() {
    let newContent = '';
    const upper = Math.floor(Math.random() * 10 + 1);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < upper; i++) {
      if (newContent !== '') {
        newContent += ' ';
      }
      newContent += this.selectRandomWord();
    }
    return newContent;
  }

  update(paragraph) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.paragraphs.length - 1; i++) {
      if (this.paragraphs[i].id === paragraph.id) this.paragraphs[i] = paragraph;
    }
  }

  updateParagraphContent(paragraph) {
    const newContent = this.buildRandomSentence();
    const updated = updateParagraphContentByAPI(this.selfToJson(), paragraph, newContent);
    this.update(updated);
  }

  updateLock(paragraph, lock = true) {
    if (lock) {
      // eslint-disable-next-line no-param-reassign
      paragraph.lockedBy = this.selfToJson();
    } else {
      // eslint-disable-next-line no-param-reassign
      paragraph.lockedBy = null;
    }
    const updated = lockParagraphByAPI(this.selfToJson(), paragraph);
    this.update(updated);
  }

  remove(paragraph) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.paragraphs.length - 1; i++) {
      if (this.paragraphs[i].id === paragraph.id) this.paragraphs.splice(i, 1);
    }
  }

  removeParagraph(paragraph) {
    removeParagraphByAPI(this.selfToJson(), paragraph.id);
    this.remove(paragraph);
  }

  selectRandomParagraph() {
    if (this.paragraphs.length === 0) {
      this.addParagraph();
    }
    return this.paragraphs[Math.floor(Math.random() * this.paragraphs.length)];
  }

  randomUserBehaviour() {
    const randomAction = Math.floor(Math.random() * 4);
    const p = this.selectRandomParagraph();

    switch (randomAction) {
      case 0:
        this.addParagraph();
        break;
      case 1:
        this.updateParagraphContent(p);
        break;
      case 2:
        this.removeParagraph(p);
        break;
      case 3:
        this.updateLock(p, p.lockedBy === null ? this.selfToJson() : null);
        break;
      default:
        this.addParagraph();
        break;
    }
  }
}

export default User;
