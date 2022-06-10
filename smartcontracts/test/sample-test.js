const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("DygnifyStaking", function (accounts) {
  let token ;
  let dygnifyStaking;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("DygnifyToken");
    token = await Token.deploy("100000000000000000000000");
    await token.deployed();
    const DygnifyStaking = await ethers.getContractFactory("DygnifyStaking");
    dygnifyStaking = await DygnifyStaking.deploy(token.address,"10");
    await dygnifyStaking.deployed();

    const transaction = await token.transfer(dygnifyStaking.address,"10000000000000000000000");
    await transaction.wait();

    const transaction2 = await token.approve(dygnifyStaking.address,"10000000000000000000000");
    await transaction2.wait();

    await token.transfer(owner.address,"10000000000000000000000");

    const transaction1 = await dygnifyStaking.changeAPR(10);
    await transaction1.wait();

    
  })

  it("contract should stake amount above 0", async function () {
    const [owner] = await ethers.getSigners();
    
    const transaction1 = await dygnifyStaking.stake("100000000000000000000");
    await transaction1.wait();
    expect(await dygnifyStaking.stakingBalance(owner.address)).to.equal("100000000000000000000");
    
  });

  it("contract should unstake amount above 0 ", async function () {
    const [owner] = await ethers.getSigners();
    
    const transaction = await dygnifyStaking.stake("100000000000000000000");
    await transaction.wait();

    const transaction1 = await dygnifyStaking.unstake("10000000000000000000");
    await transaction1.wait();
    expect(await dygnifyStaking.stakingBalance(owner.address)).to.equal("90000000000000000000");
    
  });

  it('contract should fail when stacking amount is below or equal to 0', async function() {
    try {
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.stake("-100000000000000000000");
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail when unstacking amount is below or equal to 0', async function() {
    try {
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.unstake("-100000000000000000000");
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail in case of integer Overflow (stacking)', async function() {
    try {
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.stake("115792089237316195423570985008687907853269984665640564039457584007913129639936");
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail in case of wrong input datatype (stacking)', async function() {
    try { 
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.stake("text");
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail in case of integer Overflow (unstacking)', async function() {
    try {
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.unstacking("115792089237316195423570985008687907853269984665640564039457584007913129639936");
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail in case of wrong input datatype (unstacking)', async function() {
    try {
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.unstacking("text");
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail in case of wrong input datatype (Number) calculateTotalYield ', async function() {
    try {
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.calculateYieldTotal(25);
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail in case of wrong input datatype (String) calculateTotalYield ', async function() {
    try {
      const [owner] = await ethers.getSigners();
      const transaction1 = await dygnifyStaking.calculateYieldTotal("text");
    await transaction1.wait();
    } catch (err) {
      return err;
    }
    expect.fail('Expected an exception but none was received');
  });

  it('contract should fail when executor of the function is not owner', async function() { 
    try {

      const [owner, user] = await ethers.getSigners();
      
      const transaction1 = await dygnifyStaking.changeAPR(10, {from: user.address});
      
      await transaction1.wait();
    
    } 
    catch (err) {
    
      return err;
    
    }
    
    expect.fail( 'Expected an exception but none was received');

});

it('contract should fail in case of negative APR input', async function() {

  try { 
    const [owner, user] = await ethers.getSigners();
    
    const transaction = await dygnifyStaking.changeAPR(-10, {from: user.address});
    
    await transaction1.wait();
  
  } 
  catch (err) {
  
    return err;
  
  }
  
  expect.fail('Expected an exception but none was received');

});

it( 'contract should fall in case of integer overflow', async function() {

  try { 
    const [owner, user] = await ethers.getSigners();
    
    const transaction1 = await dygnifyStaking.changeAPR(115792089237316195423570985008687907853269984665640564039457584007913129639936);
    
    await transaction1.wait();
  
  } 
  catch (err) {
  
    return err;
  }
  expect.fail("Expected an exception but none was received");

});
       

it('contract should fail when executor of the withdrawTo function is not owner', async function() { 
  
  try {

    const [owner, user] = await ethers.getSigners();
    
    const transaction1 = await dygnifyStaking.withdrawTo("1000000000000000000000", user.address, {from: user.address});
    
    await transaction1.wait();
  
  } 
  catch (err) {
  
    return err;
  
  }
  
  expect.fail( 'Expected an exception but none was received');

});

it('Total Yield after 1year must be 10^19', async function() { 
  
  const [owner] = await ethers.getSigners();
    
    const transaction = await dygnifyStaking.stake("100000000000000000000");
    await transaction.wait();

    const days = 365 * 24 * 60 * 60;

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;

    await ethers.provider.send('evm_increaseTime', [days]);
    await ethers.provider.send('evm_mine');

    const blockNumAfter = await ethers.provider.getBlockNumber();
    const blockAfter = await ethers.provider.getBlock(blockNumAfter);
    const timestampAfter = blockAfter.timestamp;

    expect(blockNumAfter).to.be.equal(blockNumBefore + 1);
    expect(timestampAfter).to.be.equal(timestampBefore + days);

    expect(await  dygnifyStaking.getTotalYield()).to.equal("10000000000000000000");

});

});