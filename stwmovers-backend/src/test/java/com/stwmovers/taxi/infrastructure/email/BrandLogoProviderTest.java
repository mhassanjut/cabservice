package com.stwmovers.taxi.infrastructure.email;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class BrandLogoProviderTest {

    @Test
    void loadsEmbeddedLogoAssets() {
        BrandLogoProvider provider = new BrandLogoProvider();

        assertTrue(provider.logoBytes().length > 1000);
        assertTrue(provider.dataUri().startsWith("data:image/png;base64,"));
        assertTrue(provider.emailCidReference().startsWith("cid:"));
    }
}
