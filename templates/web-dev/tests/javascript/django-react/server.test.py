def test_django_settings_module_is_defined():
    settings_module = "config.settings.dev"

    assert settings_module.startswith("config.settings")
