type ContainerDependency<T> = new (container: Container) => T;

class Container {
  #dependencies = new Map<ContainerDependency<unknown>, unknown>();

  get<T>(dependency: ContainerDependency<T>) {
    if (!this.#dependencies.has(dependency)) {
      this.#dependencies.set(dependency, new dependency(this));
    }
    const dependencyInstance = this.#dependencies.get(dependency);
    if (!dependencyInstance) {
      throw new Error(`Dependency ${dependency.name} not found`);
    }
    return dependencyInstance as T;
  }
}

export { Container };
