//! XingJu 星聚 v2.0 - Rust 容器化核心

mod api;
mod container;
mod database;
mod cache;
mod utils;

use pyo3::prelude::*;

/// Python 模块定义
#[pymodule]
fn xingju_core(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<container::PyModuleContainer>()?;
    m.add_class::<api::PyMusicAPI>()?;
    m.add_class::<api::PyVideoAPI>()?;
    m.add_class::<api::PyNovelAPI>()?;
    m.add_class::<api::PyMangaAPI>()?;
    Ok(())
}
