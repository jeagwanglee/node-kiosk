require('dotenv').config();
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const OptionsRepository = require('./repositories/options.repository');
const optionsRepository = new OptionsRepository();

//서버 최초 기동시 option 테이블의 모든 정보를 메모리에 캐싱

// 옵션 조회 API를 서버 기동시 호출

const cacheOptions = async (req, res, next) => {
  try {
    const options = await optionsRepository.findAllOptions();
    options.forEach((option) => {
      console.log(option.toJSON());
    });
    myCache.set(process.env.CACHE_KEY, options);
    console.log('Options cached successfully!');
  } catch (error) {
    console.error('Error caching options:', error);
  }
};

module.exports = { myCache, cacheOptions };
