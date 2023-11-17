import { api } from '@test/api';
import * as fs from 'fs';
import {
  IMMICH_TEST_ASSET_PATH,
  IMMICH_TEST_ASSET_TEMP_PATH,
  restoreTempFolder,
  testApp,
} from 'immich/test/test-utils';
import { LoginResponseDto } from 'src/api/open-api';
import ServerInfo from 'src/commands/server-info';
import Upload from 'src/commands/upload';
import { INestApplication } from '@nestjs/common';
import { Http2SecureServer } from 'http2';
import { APIKeyCreateResponseDto } from '@app/domain';

describe(`CLI (e2e)`, () => {
  let server: any;
  let admin: LoginResponseDto;
  let apiKey: APIKeyCreateResponseDto;

  beforeAll(async () => {
    [server] = await testApp.create({ jobs: true });
  });

  afterAll(async () => {
    await testApp.teardown();
    await restoreTempFolder();
  });

  beforeEach(async () => {
    await testApp.reset();
    await restoreTempFolder();
    await api.authApi.adminSignUp(server);
    admin = await api.authApi.adminLogin(server);
    apiKey = await api.apiKeyApi.createApiKey(server, admin.accessToken);
    process.env.IMMICH_API_KEY = apiKey.secret;
  });

  describe('server-info', () => {
    it('should show server version', async () => {
      await new ServerInfo().run();
    });
  });

  describe('upload', () => {
    it('should upload a folder recursively', async () => {
      await new Upload().run([`${IMMICH_TEST_ASSET_PATH}/albums/nature/`], { recursive: true });
      const assets = await api.assetApi.getAllAssets(server, admin.accessToken);
      expect(assets.length).toBeGreaterThan(4);
    });
  });
});
