const TestUtils = require('@vue/test-utils');

require('consola');

TestUtils.config.stubs['nuxt-link'] = TestUtils.RouterLinkStub;
TestUtils.config.stubs['client-only'] = '<div><slot /></div>';
