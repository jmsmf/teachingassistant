import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

var configure = function () {
  this.setDefaultTimeout(60 * 1000);
};

module.exports = configure;

let sleep = (ms => new Promise(resolve => setTimeout(resolve, ms)));

let pAND = ((p,q) => p.then(a => q.then(b => a && b)))

defineSupportCode(function ({ Given, When, Then }) {
    Given(/^I’m at the grading page$/, async () => {
        await browser.get("http://localhost:4200/");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='metas']").click();
    })

    Given(/^there’s a registered student called "([^\"]*)"$/, async (name) => {
        var allnames : ElementArrayFinder = element.all(by.css('.name'));
        await allnames;
        var registeredName = allnames.filter(elem => elem.getText().then(text => text === name));  
        await registeredName;

        await browser.get("http://localhost:4200/");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='alunos']").click();

        await $("input[name='namebox']").sendKeys(<string> name);
        await element(by.buttonText('Adicionar')).click();
        

        await browser.get("http://localhost:4200/metas");

        var allnames : ElementArrayFinder = element.all(by.css('.name'));
        await allnames;
        var registeredName = allnames.filter(elem => elem.getText().then(text => text === name));
        await registeredName;
        await registeredName.then(elems => expect(Promise.resolve(elems.length)).to.eventually.equal(1));
        
    });

    When(/^I fill all of "([^\"]*)"’s grades with "([^\"]*)"s, except one$/, async (name, grade) => {
        await $(`.${name}requisitos`).sendKeys(<string> grade);
        await $(`.${name}gerDeConfiguracaoa`).sendKeys(<string> grade);
        await $(`.${name}gerDeConfiguracaoa`).sendKeys(<string> "");
    });

    // When(/^I fill all of "[^\"]*"’s grades with valid grades, all "[^\"]*"s$/, async (name, grade) => {
        // await $("input[name='namebox']").sendKeys(<string> name);
        // await $("input[name='cpfbox']").sendKeys(<string> cpf);
        // await element(by.buttonText('Adicionar')).click();
    // });


    // When(/^I fill all of "[^\"]*"’s grades with grades, all "[^\"]*"s and one "[^\"]*"$/, async (name, grade, wrongGrade) => {
        // await $("input[name='namebox']").sendKeys(<string> name);
        // await $("input[name='cpfbox']").sendKeys(<string> cpf);
        // await element(by.buttonText('Adicionar')).click();
    // });


    Then(/^I can see “[^\"]*" in "[^\"]*"’s average grade column with a title “[^\"]*"$/, async (grade, name, title) => {
        var media = element.all(by.css$(`.${name}media`));
        await expect(Promise.resolve(media.getAttribute('value')).to.eventually.equal(grade));
        await expect(Promise.resolve(media.getAttribute('title')).to.eventually.equal(title));
    });

    // Then(/^I can see "[^\"]*" in "[^\"]*"’s average grade column$/, async (grade, name) => {
        // var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
        // allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name))).then(elems => expect(Promise.resolve(elems.length)).to.eventually.equal(1));
    // });

    // Then(/^I can see "[^\"]*", painted "[^\"]*", in "[^\"]*"’s average grade column$/, async (grade, color, name) => {
        // var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
        // allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name))).then(elems => expect(Promise.resolve(elems.length)).to.eventually.equal(1));
    // });
})