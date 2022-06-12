export class Group {
  /**
   * Creates a new permission group
   * @param {String} name name of the group
   */
  constructor(name) {
    this.name = name;

    /**
     * A Object storing permissions that this group can use
     * @type {Object<String, Boolean>}
     */
    this.permissions = {};
    /**
     * A list of all the groups this group inherits
     * @type {Array<Group>}
     */
    this.inherits = [];
  }

  /**
   * Sets a permission for this group
   * @param {String} name name of the permission
   * @param {Boolean} value if this permission can be used or not
   */
  setPermission(name, value) {
    this.permissions[name] = value;
  }

  /**
   * Unsets a permission for this group
   * @param {String} name permission to unset
   */
  unsetPermission(name) {
    delete this.permissions[name];
  }

  /**
   * The permissions this group has access to
   * @returns {Object}
   */
  getPermissions() {
    return this.permissions;
  }

  /**
   * Inherites all permissions from that group
   * @param {Group} group the group you want this group to inherit
   */
  inherit(group) {
    this.inherits.push(group);
  }

  /**
   * Uninherits a group
   * @param {Group} group group to uniherit
   */
  unInherit(group) {
    this.inherits.splice(this.inherits.indexOf(group), 1);
  }
}
