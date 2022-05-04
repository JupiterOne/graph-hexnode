# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- Fixed an issue regarding user group id not being accessible and improved
  retries (429).

## 1.0.0 - 2022-04-08

### Added

- Ingest new entities
  - `hexnode_account`
  - `hexnode_user`
  - `hexnode_user_group`
  - `hexnode_device`
  - `hexnode_device_group`
- Build new relationships
  - `hexnode_account_has_device`
  - `hexnode_account_has_device_group`
  - `hexnode_account_has_user`
  - `hexnode_account_has_user_group`
  - `hexnode_device_group_has_device`
  - `hexnode_user_group_has_user`
  - `hexnode_user_has_device`
