import { module, test } from 'qunit';
import { v4 as uuidv4 } from 'uuid';
import { setupApplicationTest } from 'vault/tests/helpers';
import authPage from 'vault/tests/pages/auth';
import { deleteEngineCmd, mountEngineCmd, runCmd, tokenWithPolicyCmd } from 'vault/tests/helpers/commands';
import { personas } from 'vault/tests/helpers/policy-generator/kv';
import { setupControlGroup, writeSecret } from 'vault/tests/helpers/kv/kv-run-commands';

/**
 * This test set is for testing version history & diff pages
 * VAULT-18817
 */
module('Acceptance | kv-v2 workflow | version history & diff', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.backend = `kv-workflow-${uuidv4()}`;
    await authPage.login();
    await runCmd(mountEngineCmd('kv-v2', this.backend), false);
    await writeSecret(this.backend, 'app/first-secret', 'foo', 'bar');
  });

  hooks.afterEach(async function () {
    await authPage.login();
    return runCmd(deleteEngineCmd(this.backend));
  });

  module('admin persona', function (hooks) {
    hooks.beforeEach(async function () {
      const token = await runCmd(tokenWithPolicyCmd('admin', personas.admin(this.backend)));
      await authPage.login(token);
    });
    test.skip('can navigate to the version history page', async function (assert) {
      assert.expect(0);
    });
    test.skip('history works correctly when no secrets', async function (assert) {
      assert.expect(0);
    });
    test.skip('history works correctly when only one secret version', async function (assert) {
      assert.expect(0);
    });
    test.skip('history works correctly when many secret versions in various states', async function (assert) {
      assert.expect(0);
    });
    test.skip('can navigate to the version diff view', async function (assert) {
      assert.expect(0);
    });
    test.skip('diff works correctly when no secrets', async function (assert) {
      assert.expect(0);
    });
    test.skip('diff works correctly when only one secret version', async function (assert) {
      assert.expect(0);
    });
    test.skip('diff works correctly between various secret versions', async function (assert) {
      assert.expect(0);
    });
  });

  module('data-reader persona', function (hooks) {
    hooks.beforeEach(async function () {
      const token = await runCmd([tokenWithPolicyCmd('data-reader', personas.dataReader(this.backend))]);
      await authPage.login(token);
    });
    // Copy test outline from admin persona
  });

  module('data-list-reader persona', function (hooks) {
    hooks.beforeEach(async function () {
      const token = await runCmd([
        tokenWithPolicyCmd('data-list-reader', personas.dataListReader(this.backend)),
      ]);
      await authPage.login(token);
    });
    // Copy test outline from admin persona
  });

  module('metadata-maintainer persona', function (hooks) {
    hooks.beforeEach(async function () {
      const token = await runCmd([
        tokenWithPolicyCmd('metadata-maintainer', personas.metadataMaintainer(this.backend)),
      ]);
      await authPage.login(token);
    });
    // Copy test outline from admin persona
  });

  module('secret-creator persona', function (hooks) {
    hooks.beforeEach(async function () {
      const token = await runCmd([
        tokenWithPolicyCmd('secret-creator', personas.secretCreator(this.backend)),
      ]);
      await authPage.login(token);
    });
    // Copy test outline from admin persona
  });

  module('enterprise controlled access persona', function (hooks) {
    hooks.beforeEach(async function () {
      const userPolicy = `
path "${this.backend}/data/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
  control_group = {
    max_ttl = "24h"
    factor "approver" {
      controlled_capabilities = ["write"]
      identity {
          group_names = ["managers"]
          approvals = 1
      }
    }
  }
}

path "${this.backend}/*" {
  capabilities = ["list"]
}

// Can we allow this so user can self-authorize?
path "sys/control-group/authorize" {
  capabilities = ["update"]
}

path "sys/control-group/request" {
  capabilities = ["update"]
}
`;
      const { userToken } = await setupControlGroup({ userPolicy });
      this.userToken = userToken;
      return authPage.login(userToken);
    });
    // Copy test outline from admin persona
  });
});